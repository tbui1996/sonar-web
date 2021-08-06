locals {
  mime_type = jsondecode(file("${path.root}/mime.json"))
}
