rm -rf dist

node node_modules/.bin/babel \
	--ignore node_modules,test \
	. \
	--out-dir dist
