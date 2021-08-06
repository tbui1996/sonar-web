# Certificate and Domain Configurations
resource "aws_acm_certificate" "web" {
  domain_name       = var.domain_name
  validation_method = "DNS"

  tags = {
    Name          = var.domain_name
    ProductDomain = "Sonar Internal Web Applications"
    Environment   = var.environment
    Description   = "Certificate for ${var.domain_name}"
    ManagedBy     = "terraform"
  }
}

resource "aws_acm_certificate_validation" "validate_web" {
  certificate_arn         = aws_acm_certificate.web.arn
  validation_record_fqdns = [for record in aws_route53_record.web_route53 : record.fqdn]
}

resource "aws_route53_record" "web_route53_dns" {
  for_each = {
    for dvo in aws_acm_certificate.web.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }
  name            = each.value.name
  records         = [each.value.record]
  type            = each.value.type
  zone_id         = var.zone_id
  ttl             = 60
  allow_overwrite = true
}


resource "aws_route53_record" "web_route53" {
  zone_id = var.zone_id
  name    = var.domain_name
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.cdn.domain_name
    zone_id                = aws_cloudfront_distribution.cdn.hosted_zone_id
    evaluate_target_health = false
  }
}
