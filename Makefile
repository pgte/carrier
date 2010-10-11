all: test

test:
	node tools/test.js test_no_br test_one_line_ending_in_nl test_line_breaks test_concatenation

.PHONY: test