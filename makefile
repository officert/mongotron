postinstall:
	cd ./node_modules; \
	ln -snf ../src; \
	ln -snf ../src/lib;

#
# .PHONY: build
