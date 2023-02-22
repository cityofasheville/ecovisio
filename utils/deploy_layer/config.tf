terraform {
  backend "s3" {
    bucket = "avl-tfstate-store"
    key    = "terraform/ecovisio/layer/terraform_dev.tfstate"
    region = "us-east-1"
  }
}

provider "aws" {
  region = var.region
}

resource "aws_lambda_layer_version" "ecovisio_layer" {
  filename   = "layer.zip"
  source_code_hash = filebase64sha256("layer.zip")
  layer_name = "ecovisio_layer"
}

output "ecovisio_layer_arn" {
  value = aws_lambda_layer_version.ecovisio_layer.arn
}
