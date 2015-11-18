postinstall:	createDevelopmentSymLinks

createDevelopmentSymLinks:
	cd ./node_modules; \
	ln -snfv ../src src; \
	ln -snfv ../src/lib lib; \
	ln -snfv ../tests tests; \

createProductionSymLinks:
	cd ./node_modules; \
	ln -snfv ../build src; \
	ln -snfv ../build/lib lib; \

#
# .PHONY: build
