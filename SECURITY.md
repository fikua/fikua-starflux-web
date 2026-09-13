# Security Policy

## Reporting a Vulnerability

Please **do not** open a public GitHub Issue for security vulnerabilities.

Instead, use GitHub's private vulnerability reporting: go to the [Security tab](https://github.com/fikua/fikua-starflux-web/security) and click **"Report a vulnerability"**. This opens a private advisory visible only to you and the maintainers.

## Scope

This repository is a static marketing site (no backend, no user data collection, no forms) deployed to Cloudflare Workers Static Assets. In-scope reports include XSS via page content, dependency vulnerabilities in the build tooling, and Cloudflare configuration issues (`wrangler.toml`, DNS).

For vulnerabilities in the Starflux application itself, report them against [fikua/fikua-starflux](https://github.com/fikua/fikua-starflux/security) instead.
