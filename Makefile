.PHONY: test

watch:
	@grunt

test:
	@mocha -R spec

build:
	grunt build

push:
	git push origin master develop
	git push --tags
	git checkout develop

release:
	git flow release start $(R)
	git flow release finish $(R)
	git checkout develop
