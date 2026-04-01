SEG ?= personalCommInfo

lint:
	npm run lint:hints:strict -- ./packages/$(SEG)

enums:
	npm run gen:enums -- --segment $(SEG)

schemas:
	npm run gen:schemas -- --segment $(SEG)

compile:
	npm run compile:schemas -- --segment $(SEG)

templates:
	npm run gen:templates -- --segment $(SEG)

test-templates:
	npm run test:templates -- --segment $(SEG)

examples:
	npm run validate:examples -- --segment $(SEG)
