
#!/bin/bash

# Crear carpetas
mkdir -p src/components
mkdir -p src/layouts
mkdir -p src/pages
mkdir -p src/styles
mkdir -p src/lib
mkdir -p src/icons
mkdir -p src/context
mkdir -p src/hooks
mkdir -p src/types
mkdir -p src/services

# Crear archivos README.md en cada carpeta
for dir in src/components src/layouts src/pages src/styles src/lib src/icons src/context src/hooks src/types src/services
  do
    echo "# $(basename $dir)

Esta carpeta contiene elementos relacionados con $(basename $dir) del proyecto." > "$dir/README.md"
  done

echo "Estructura creada correctamente."
