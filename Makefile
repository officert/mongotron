MOCHA=node_modules/.bin/_mocha
KARMA=node_modules/karma/bin/karma
ISTANBUL=node_modules/.bin/istanbul

test: test-int test-unit test-unit-ui

test-int:
	@NODE_ENV=test \
	$(MOCHA) tests/integration/**/*-test.js --reporter spec

test-unit:
	@NODE_ENV=test \
	$(MOCHA) tests/unit/**/*-test.js --reporter spec

test-unit-ui:
	@NODE_ENV=test \
	$(KARMA) start ./tests/ui/karma.conf.js

coverage:
	@NODE_ENV=test \
	$(ISTANBUL) cover \
	$(MOCHA) tests/unit/**/*-test.js tests/integration/**/*-test.js

coveralls:
	cat ./coverage/lcov.info | ./node_modules/.bin/coveralls

.PHONY: coverage
