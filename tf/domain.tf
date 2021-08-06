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
  validation_record_fqdns = [aws_route53_record.web_route53.fqdn]
}

resource "aws_route53_record" "web_route53" {
  zone_id = var.zone_id
  name    = var.domain_name
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.cdn.domain_name
    zone_id                = aws_cloudfront_distribution.cnd.hosted_zone_id
    evaluate_target_health = false
  }
}
