resource "aws_iam_role" "ecovisio-role" {
    name = "ecovisio-role"
    assume_role_policy = file("./policy_role.json")
    tags = {
      Name          = "ecovisio-role"
      "coa:application" = "ecovisio"
      "coa:department"  = "information-technology"
      "coa:owner"       = "jtwilson@ashevillenc.gov"
      "coa:owner-team"  = "dev"
      Description   = "Role used by ecovisio lambda function."
    }
}

resource "aws_iam_role_policy_attachment" "lambda_vpc_access" {
    role        = aws_iam_role.ecovisio-role.name
    policy_arn  = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
}

resource "aws_iam_policy" "secrets_manager_policy-ecovisio" {
  name        = "secrets_manager_policy-ecovisio"
  description = "Read secrets"
  policy = templatefile("./policy_secrets_manager.json",{})
}

resource "aws_iam_role_policy_attachment" "secrets_manager" {
    role        = aws_iam_role.ecovisio-role.name
    policy_arn  = aws_iam_policy.secrets_manager_policy-ecovisio.arn
}

output "ecovisio_role_arn" {
  value = "${aws_iam_role.ecovisio-role.arn}"
}