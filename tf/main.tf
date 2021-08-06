terraform {
  backend "http" {}

  required_providers {
    aws = {
      source = "hashicorp/aws"
      version = "~> 3.0"
    }
  }
}

# Provider
provider "aws" {
  region = "us-east-1"
}
