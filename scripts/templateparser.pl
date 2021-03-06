#!/usr/local/bin/perl -w
# BEGIN LICENSE BLOCK
###############################################################################
# Copyright (C) 2001-2003 Florian Bischof <flo@fxb.de>
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
# END LICENSE BLOCK
#
# parses template files
#
###############################################################################

use strict;
use utf8;

my $DEBUG = 1;
my $TEMPDIR = "htdocs";
my $TEMPLATEDIR = "src";

require "scripts/JWC::I18N.pm";
use File::Find;
use File::Path;
use Encode 'encode_utf8';
use Regexp::Common;

JWC::I18N::Init();

# Tell me more about warnings
use Carp ();
$SIG{__WARN__} = \&Carp::cluck;


binmode(STDERR, ":utf8");

print STDERR "Pre-loading Templates...\n" if ($DEBUG);

# get list with all languages
my @languages;
foreach my $lang (<po/*.po>) {
	$lang =~ s|.*/||;
	$lang =~ s|\.po$||;
	push(@languages, $lang);
}

my %templates;
my %isa_scan = ();

# get template-list
find(
     sub {
       return unless /\.(html|js)$/;
			 return if /^\.#/;
			 $templates{substr($File::Find::name,length($TEMPLATEDIR))} = $File::Find::name;
		 },
     $TEMPLATEDIR
    );


foreach my $filename (keys %templates) {
	my $file = $templates{$filename};

	print STDERR "$file ... \n" if ($DEBUG);

	# update all language dictionaries
	foreach my $lang (@languages) {
		my $lh = JWC::I18N->get_handle($lang) || die "What language?";

    unless (open _, $file) {
        print STDERR "Cannot open $file for reading ($!), skipping.\n" if ($DEBUG);
        return;
    }

		my $langfilename = "$filename.$lang";
		my $langfile = "$TEMPDIR/$langfilename";
		$langfile =~ /(.*)(\/|\\)[^\/\\]+$/;
		mkpath($1);

    unless (open LANGFILE, ">$langfile") {
        print STDERR "Cannot open $langfile for writing ($!), skipping.\n" if ($DEBUG);
        return;
    }
		binmode(LANGFILE, ":utf8");

    $_ = join('',<_>);
		my $lastpos = 0;
		my $translation = '';


    # pxx.to filter: <l>...</l>
		while (m!\G.*?(?=<l(\s.*?|)>(.*?)</l>)!sg) {
			my ( $vars, $str ) = ( $1, $2 );
			$str =~ s/\\'/\'/g;   # '
      my $pos = pos();

      $translation .= substr($_, $lastpos, $pos-$lastpos);
      $translation .= '<&|/l&>'.$lh->maketext($str);

      $lastpos = $pos + length($str.$vars)+7;
      pos() = $lastpos;

    }
    $translation .= substr($_, $lastpos);


    # Localization function: loc(...)
    $_ = $translation;
    $translation = '';
    $lastpos = 0;
		pos() = 0;
   # while (m/\G.*?\bloc$RE{balanced}{-parens=>'()'}{-keep}/sg) {
    while (m/\G.*?loc$RE{balanced}{-parens=>'()'}{-keep}/sg) {
        my $match = $1;
	my $pos = pos() - length($match) - 3;

        #$line += ( () = ( $& =~ /\n/g ) );    # cryptocontext!

        my ( $vars, $str );
        if ( $match =~
                /\(\s*($RE{delimited}{-delim=>q{'"}}{-keep})(.*?)\s*\)$/ ) {
	  #print STDERR $match;
            $str = substr( $1, 1, -1 );       # $str comes before $vars now
            $vars = $9;
        }
        else {
            next;
        }

        $vars =~ s/[\n\r]//g;
        $str  =~ s/\\'/\'/g;


        $vars =~ s/^,//;
	my @vars = split(/,/, $vars);
	for (my $i = 0; $i <= $#vars; $i++) {
	  $vars[$i] =~ s/^\s+//;
	  $vars[$i] = '"+'.$vars[$i].'+"';
	}
	#print STDERR "vars: *".join("*", @vars)."...";
	my $trans = '"'.$lh->maketext($str, @vars).'"';
	$trans =~ s/\+\"\"$//;

	$translation .= substr($_, $lastpos, $pos-$lastpos);
	$translation .= $trans;
	
	$lastpos = $pos + length($match)+3;

        #print STDERR "$filename: GOT $str ($vars) -> $trans\n";

	pos() = $lastpos; 
      }


		
    # sort <&|/sort&> regions
    while ($translation =~ m/<&\|\/sort&>(.+)<\/sort&>/sg) {
			my $region = join("\n", sort { 
				$a =~ /<&\|\/l&>(.*)/; my $aa = $1;
				$b =~ /<&\|\/l&>(.*)/; my $bb = $1;
				$aa cmp $bb;
			} split(/\n/,$1));

			#print "\nGOT THIS".('x'x30).'\n';
			$translation =~ s/<&\|\/sort&>(.+)<\/sort&>/$region/s;
		}

    $translation .= substr($_, $lastpos);

    # remove temporary language-marks
    $translation =~ s/<&\|\/l&>//g;

    # And now: Crunch it...
    # disabled by now ... should be comand line option
    if (0) {
      $translation =~ s/^\s+//mg;           # remove whitespaces
      $translation =~ s/^\/\/[^\-].*$//mg;       # remove // comments
      $translation =~ s/([{}\);])[ \t]*\/\/.*$/$1/mg;   # remove ; // comments
      $translation =~ s/^\/\*.*\*\/$//mg;       # remove /* comments */
    }

    print LANGFILE $translation;
    close(LANGFILE);
    close(_);
  }
}

print STDERR "done.\n";


1;
