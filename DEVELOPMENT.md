# Development Guide



## Documentation

Documentation should follow major.minor version of Async Storage. Update the documentation version in root's package.json:

```json
{
  "versionDocs": "3.0"
}
```

### Deployment

Add new remote where docs are hosted:

```shell
# use https if not using ssh
git remote add docs git@github.com:react-native-async-storage/uniplay-io.github.io/async-storage.git
```

Fetch gh-pages branch:

```shell
git fetch docs gh-pages
```

Use python 3 to install dependencies:

```shell
pip install --no-deps -r .github/requirements.txt
```

Run `mike deploy` to deploy docs and mark them as latest:

```shell
mike deploy -u -r docs --push DOCS_VERSION_FROM_PCK_JSON latest
```





