# scripts
- `jlpm install` installs dependencies (including dev dependencies) from package.json. This is required in order to build the extension (at least the frontend code (not 100% sure on whether the python build is different, I think it uses hatch?))
    - i.e. typescript, @jupyterlab/builder, @jupyterlab/application, etc.
- `jlpm build` builds the extension (generate output files: entrypoint, css styles, javascript code). output is specified by package.json -> jupyterlab.outputDir
- `uv pip install -e .` installs the python package (this contains the built js files)