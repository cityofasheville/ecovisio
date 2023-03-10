terraform {
  backend "s3" {
    bucket = "avl-tfstate-store"
    key    = "terraform/ecovisio/terraform_dev.tfstate"
    region = "us-east-1"
  }
}

data "terraform_remote_state" "ecovisio_layer" {
  backend = "s3"
  config = {
    bucket = "avl-tfstate-store"
    key    = "terraform/ecovisio/layer/terraform_dev.tfstate"
    region = "us-east-1"
  }
}

provider "aws" {
  region = var.region
}

resource "aws_lambda_function" "ecovisio" {
  filename         = "function.zip"
  description      = "Read bike/ped counts from Eco-Visio API" 
  function_name    = "ecovisio"
  role             = aws_iam_role.ecovisio-role.arn # "arn:aws:iam::518970837364:role/ecovisio-role"
  handler          = "index.handler"
  runtime          = "nodejs18.x"
  source_code_hash = filebase64sha256("function.zip")
  layers = [data.terraform_remote_state.ecovisio_layer.outputs.ecovisio_layer_arn]
  timeout          = 900
  # memory_size      = 256
  vpc_config {
    subnet_ids         = var.subnet_ids
    security_group_ids = var.security_group_ids
  }
  tags = {
    Name          = "ecovisio"
    "coa:application" = "ecovisio"
    "coa:department"  = "information-technology"
    "coa:owner"       = "jtwilson@ashevillenc.gov"
    "coa:owner-team"  = "dev"
    Description   = "ecovisio API download."
  }
}

output "ecovisio_arn" {
  value = aws_lambda_function.ecovisio.arn
}
