#!/usr/bin/perl -w 
###############################################################################
# Copyright (c) 1996-2002 Jesse Vincent <jesse@bestpractical.com>
#
# Portions 
# Copyright (c) 2002      Autrijus Tang <autrijus@autrijus.org>
# Copyright (C) 2003      Florian Bischof <flo@fxb.de>
#
# This program is free software; you can redistribute it and/or
# modify it under the terms of the GNU General Public License
# as published by the Free Software Foundation; either version 2
# of the License, or (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program; if not, write to the Free Software
# Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.
#
###############################################################################
#
# extract language strings from code
#
###############################################################################


use strict;

use File::Find;
use File::Copy;
use Regexp::Common;

# Tell me more about warnings
use Carp ();
$SIG{__WARN__} = \&Carp::cluck;

use vars qw($DEBUG $FILECAT);

$DEBUG = 0;

@ARGV = <po/*.po> unless @ARGV;

$FILECAT = {};

# extract all strings and stuff them into $FILECAT
print "Grabbing strings from source files\n";
File::Find::find( { wanted => \&extract_strings_from_code, follow => 1 }, './src' );

# ensure proper escaping and [_1] => %1 transformation
foreach my $str ( sort keys %{$FILECAT} ) {
    my $entry = $FILECAT->{$str};
    my $oldstr = $str;
    $str =~ s/\\/\\\\/g;
    $str =~ s/\"/\\"/g; #"
    $str =~ s/\[_(\d+)\]/%$1/g;
    $str =~ s/~([\[\]])/$1/g;

    $str =~ s/\n/\\n\"\n\"/g;
    $entry =~ s/\n/\\n\"\n\"/g;
    delete $FILECAT->{$oldstr};
    $FILECAT->{$str} = $entry;
}

# update all language dictionaries
foreach my $lang (@ARGV) {
    $lang =~ s|.*/||;
    $lang =~ s|\.po$||;

    update($lang);
}


# {{{ pull strings out of the code.

sub extract_strings_from_code {
    my $file = $_;

    local $/;
    return if ( -d $_ );
    return if ( $File::Find::dir =~ 'po|scripts|htdocs' );
    return if ( /\.po$|\.bak$|\.gif$|\.png$|\.patch$|~|,D|,B$|extract-message-catalog\.pl$/ );
    return if ( /^[\.#]/ );

    print "Looking at $File::Find::name\n" if ($DEBUG);
    my $filename = $File::Find::name;
    $filename =~ s'^\./''; #'

    unless (open _, $file) {
        print "Cannot open $file for reading ($!), skipping.\n";
        return;
    }

    $_ = <_>;

    # Mason filter: <&|/l>...</&>
    my $line = 1;
    if ($file =~ /html/) {
      while (m!\G.*?<&\|/l(.*?)&>(.*?)</&>!sg) {
        my ( $vars, $str ) = ( $1, $2 );
        $line += ( () = ( $& =~ /\n/g ) );    # cryptocontext!
        $str =~ s/\\'/\'/g; #'
        #print "STR IS $str\n";
        push @{ $FILECAT->{$str} }, [ $filename, $line, $vars ];
      }
    }

    # jwchat filter: <l>...</l>
    $line = 1;
    pos($_) = 0;
    if ($file =~ /html/ || $file =~ /php/ || $file =~ /inc/ || $file =~ /css/) {
      while (m!\G.*?<l(\s.*?|)>(.*?)</l>!sg) {
        my ( $vars, $str ) = ( $1, $2 );
        $line += ( () = ( $& =~ /\n/g ) );    # cryptocontext!
        $str =~ s/\\'/\'/g; #'
        #print "STR IS $str\n";
        push @{ $FILECAT->{$str} }, [ $filename, $line, $vars ];
      }
    }

    # Localization function: loc(...)
    $line = 1;
    pos($_) = 0;
    while (m/\G.*?\bloc$RE{balanced}{-parens=>'()'}{-keep}/sg) {
   # while (m/\G.*?\{loc\}$RE{balanced}{-parens=>'()'}{-keep}/sg) {
        my $match = $1;
        $line += ( () = ( $& =~ /\n/g ) );    # cryptocontext!

        my ( $vars, $str );
        if ( $match =~
                /\(\s*($RE{delimited}{-delim=>q{'"}}{-keep})(.*?)\s*\)$/ ) { #"'

            $str = substr( $1, 1, -1 );       # $str comes before $vars now
            $vars = $9;
        }
        else {
            next;
        }

        $vars =~ s/[\n\r]//g;
        $str  =~ s/\\'/\'/g; #'
        print STDERR "GOT $str ($vars)\n" if ($DEBUG);
        

        push @{ $FILECAT->{$str} }, [ $filename, $line, $vars ];
    }

    # Comment-based mark: "..." # loc
    $line = 1;
    pos($_) = 0;
    while (m/\G.*?($RE{delimited}{-delim=>q{'"}}{-keep})[\}\)\],]*\s*\#\s*loc\s*$/smg) {
      my $str = substr($1, 1, -1);
      $line += ( () = ( $& =~ /\n/g ) );    # cryptocontext!
      $str  =~ s/\\'/\'/g; #'
      push @{ $FILECAT->{$str} }, [ $filename, $line, '' ];
    }

    # Comment-based pair mark: "..." => "..." # loc_pair
    $line = 1;
    pos($_) = 0;
    while (m/\G.*?(\w+)\s*=>\s*($RE{delimited}{-delim=>q{'"}}{-keep})[\}\)\],]*\s*\#\s*loc_pair\s*$/smg) {
	my $key = $1;
	my $val = substr($2, 1, -1);
	$line += ( () = ( $& =~ /\n/g ) );    # cryptocontext!
	$key  =~ s/\\'/\'/g; #'
	$val  =~ s/\\'/\'/g; #'
	push @{ $FILECAT->{$key} }, [ $filename, $line, '' ];
	push @{ $FILECAT->{$val} }, [ $filename, $line, '' ];
    }

    close (_);
}
# }}} extract from strings

sub update {
    my $lang = shift;
    my $file = "po/$lang.po";
    my ( %Lexicon, %Header);
    my $out = '';

    unless (-w $file) {
      warn "Can't write to $lang, skipping...\n";
      next;
    }

    print "Updating $lang...\n";

    open LEXICON, $file or die $!;

    my @lines = (<LEXICON>);
    # preserve header
    my $line;
    foreach $line (@lines) {
      $out .= $line;
      last if ($line =~ /^\s+/);
    }
    @lines = grep { !/^(#(:|\.)\s*|$)/ } @lines;
    while (@lines) {
        my $msghdr = "";
        $msghdr .= shift @lines while ( $lines[0] && $lines[0] !~ /^msgid/ );
        my $msgid = "";
        $msgid  .= shift @lines while ( $lines[0] =~ /^(msgid|")/ ); #"
        my $msgstr = "";
        $msgstr .= shift @lines while ( $lines[0] && $lines[0] =~ /^(msgstr|")/ ); #"

        last unless $msgid;

        chomp $msgid;
        chomp $msgstr;

        #print "string: $msgid\t$msgstr\n"; # debug

        $msgid  =~ s/^msgid "(.*)"$/$1/ms or die $msgid;
        $msgstr =~ s/^msgstr "(.*)"$/$1/ms or die $msgstr;

        $Lexicon{$msgid} = $msgstr;
        $Header{$msgid}  = $msghdr;
    }

    my $is_english = ( $lang =~ /^en(?:[^A-Za-z]|$)/ );

    foreach my $str ( sort keys %{$FILECAT} ) {
        $Lexicon{$str} ||= '';;
    }
    foreach ( sort keys %Lexicon ) {
        my $f = join ( ' ', sort map $_->[0].":".$_->[1], @{ $FILECAT->{$_} } );
        my $nospace = $_;
        $nospace =~ s/ +$//;

        if ( !$Lexicon{$_} and $Lexicon{$nospace} ) {
          $Lexicon{$_} =
            $Lexicon{$nospace} . ( ' ' x ( length($_) - length($nospace) ) );
        }

        next if !length( $Lexicon{$_} ) and $is_english;

        my %seen;
        $out .= $Header{$_} if exists $Header{$_};
        if ( $f && $f !~ /^\s+$/ ) {

            $out .= "#: $f\n";
        }
        else {
            $out .= "#: NOT FOUND IN SOURCE\n";

        }
        foreach my $entry ( grep { $_->[2] } @{ $FILECAT->{$_} } ) {
            my ( $file, $line, $var ) = @{$entry};
            $var =~ s/^\s*,\s*//;
            $var =~ s/\s*$//;
            $out .= "#. ($var)\n" unless $seen{$var}++;
        }
        $out .= "msgid \"$_\"\nmsgstr \"$Lexicon{$_}\"\n\n";
    }

    open PO, ">$file" or die $!;
    print PO $out;
    close PO;

    return 1;
}

__END__
# Local variables:
# c-indentation-style: bsd
# c-basic-offset: 4
# indent-tabs-mode: nil
# End:
# vim: expandtab shiftwidth=4:
