locals {
  mime_types = jsondecode(file("${path.root}/mime.json"))
}
