Make Instructions (incomplete)
-----------------

0. Install necessary Perl modules
  * `sudo apt-get install yum`
  * `sudo yum install cpan`
  * `cpan`
  * `o conf urllist`  # Make sure there are valid mirrors, and if not, try adding the following
  * `o conf urllist push http://cpan.strawberryperl.com/`
  * `o conf commit`
  * Control-d to leave the cpan prompt
  * `sudo cpan Locale::Maketext::Fuzzy`  # And repeat for any other necessary modules, noting that error messages like "Can't locate Locale/Maketext/Fuzzy.pm in @INC" when running `make` mean you should run more commands like this one


