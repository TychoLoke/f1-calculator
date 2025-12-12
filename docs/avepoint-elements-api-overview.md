# AvePoint Elements Graph API Overview

This guide summarizes frequently used AvePoint Elements Graph API endpoints by domain, including typical responses and dashboard use cases.

## 1. Common / Partner & Customer Management
### Customers
- **Retrieve all customers** – `POST /general/customers/batch`
  - Returns: customer ID, organization name, owner email, country/region, job status (health), linked tenants
  - Dashboard: customer list, selector, high-level health status
- **Onboard a customer** – `POST /general/customers`
  - Action: creates and onboards a new customer under the partner
  - Dashboard: partner self-service onboarding, internal provisioning automation

### Services & Licensing
- **Add a service** – `POST /general/customers/{customerId}/services`
  - Action: assigns trials or paid subscriptions (Backup, Baseline, UM, WM, etc.)
  - Dashboard: license provisioning, upsell flows
- **Retrieve all services of customers** – `POST /general/customers/services/batch`
  - Returns: active services per customer, purchased seats, assigned vs available licenses, storage, retention, expiration
  - Dashboard: licensing overview, license waste detection, renewal tracking

### Tenants & Seats
- **Retrieve tenant user seats (3rd-party products)** – `POST /general/customers/{customerId}/3rd-party-products/type/{type}/tenants/batch`
  - Returns: tenant name, assigned user seats, available user seats
  - Dashboard: Microsoft 365 seat tracking, over/under-licensing insights
- **Retrieve AvePoint product overview** – `GET /general/customers/{customerId}/avpt-products/type/{productType}/overview`
  - Returns: purchased user seats per AvePoint product
  - Dashboard: module activation tiles, entitlement checks, feature availability logic

## 2. Cloud Backup (Microsoft 365)
- **Retrieve Cloud Backup overview** – `GET /general/customers/{customerId}/cloud-backup-m365/overview`
  - Returns: protected data statistics, backup coverage summary
  - Dashboard: backup health KPI, protection completeness score
- **Retrieve protected users (batch)** – `POST /general/customers/{customerId}/tenants/{tenantId}/cloud-backup-m365/users/batch`
  - Returns: users and mailbox/OneDrive protected status
  - Dashboard: user-level backup coverage, “unprotected users” views

## 3. Jobs & Scans
- **Retrieve jobs** – `GET /general/customers/{customerId}/avpt-products/jobs/batch`
  - Returns: job status, start/end times, success/failure indicators
  - Dashboard: operational health, incident detection, job failure alerts
- **Retrieve scan profiles** – `POST /general/customers/{customerId}/scan-profiles/batch`
  - Returns: scan profile configurations
  - Dashboard: change detection setup, security scanning visibility
- **Retrieve scan profile details** – `GET /general/customers/{customerId}/scan-profiles/{scanProfileId}`
  - Returns: detailed scan configuration
- **Retrieve daily scan profile changes** – `GET /general/customers/{customerId}/scan-profiles/{scanProfileId}/changes`
  - Returns: daily configuration drift
  - Dashboard: drift monitoring, compliance auditing

## 4. Baseline Management
- **Create a baseline** – `POST /bm/baselines`
  - Action: creates a baseline from a tenant
  - Dashboard: golden tenant creation, standard definition
- **Retrieve baselines** – `POST /bm/baselines/batch`
  - Returns: baseline list, status, metadata
  - Dashboard: baseline catalog, governance overview
- **Retrieve baseline creation report** – `GET /bm/baselines/{baselineId}/reports`
  - Returns: creation job details
  - Dashboard: validation, troubleshooting
- **Retrieve BM tenants** – `POST /bm/tenants/batch`
  - Returns: tenants under baseline management
  - Dashboard: coverage overview, tenant compliance list
- **Tenant actions** – `POST /bm/customers/{customerId}/tenants/{tenantId}/actions`
  - Action: apply baseline, monitor tenant
  - Dashboard: one-click governance actions

## 5. Risk Management
- **Retrieve matched risk rules** – `GET /rm/customers/{customerId}/tenants/{tenantId}/detection/rules`
  - Returns: active risk rules matched in tenant
  - Dashboard: risk posture overview
- **Retrieve violated objects** – `GET /rm/customers/{customerId}/tenants/{tenantId}/detection/rules/{ruleId}/hit-items`
  - Returns: objects violating a rule
  - Dashboard: risk drill-down, security insights

## 6. User Management
- **Security users overview** – `GET /um/customers/{customerId}/tenants/{tenantId}/overview/security/users`
  - Returns: security-relevant users
  - Dashboard: identity risk overview
- **Retrieve users (single/batch)** – `GET /users/{userId}` and `POST /users/batch`
  - Returns: user profile details
  - Dashboard: user directory, identity visibility
- **Update user information** – multiple endpoints for contact info, manager, office, and password settings
  - Dashboard: delegated user management, MSP self-service flows
- **Risky users & compliance** – workflows, risky actions, sign-ins
  - Dashboard: identity risk analytics, conditional access insights

## 7. Workspace Management
- **Workspace overview** – `GET /wm/customers/{customerId}/tenants/{tenantId}/overview/workspace`
  - Returns: workspace statistics
  - Dashboard: collaboration health, workspace compliance
- **Compliance rate** – `GET /overview/data-protection/compliance-rate`
  - Returns: compliance metrics
  - Dashboard: governance KPIs, data security posture
- **DSPM insights** – `GET /overview/dspm/insights`
  - Returns: DSPM insights
  - Dashboard: data exposure risk
- **Ransomware detection** – `GET /overview/data-protection/ransomware-detection`
  - Returns: protection statistics
  - Dashboard: security posture reporting
