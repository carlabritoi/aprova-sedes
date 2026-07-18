$ErrorActionPreference = "Stop"
$localNode = "C:\Users\USUARIO1\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
$node = if (Get-Command node -ErrorAction SilentlyContinue) { "node" } elseif (Test-Path $localNode) { $localNode } else { throw "Node.js não foi encontrado." }
& $node "$PSScriptRoot\server.mjs"
