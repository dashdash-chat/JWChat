
all: po install

po:
	@./scripts/extract-message-catalog.pl

install:
	@if [ ! -e ./htdocs ]; then \
		echo ""; \
		mkdir ./htdocs; \
		echo "Copying Stylesheets ..."; \
		cp ./src/wcs.css ./htdocs; \
		echo "Copying Images ...";\
		cp -r ./src/images ./htdocs;\
		echo "Copying Sounds ...";\
		cp -r ./src/sounds htdocs;\
		echo ""; \
	fi
	@./scripts/templateparser.pl

clean:
	@rm -r ./htdocs

.PHONY: clean po