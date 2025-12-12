# AvePoint Elements Export Pack
- generated_at_utc: 2025-12-12T21:06:13+00:00
- output_folder: exports/elements_20251212_220613
- cap_customers: 999
- jobs_max_pages: 2

## Customers (batch)
- request: `POST /partner/external/v3/general/customers/batch`
- result: ✅ HTTP 200 (1718 ms)

```json
[
  {
    "id": "4af7ac06-e9fb-43ea-a181-c34deba9c7e8",
    "organization": "AvePoint",
    "ownerEmail": "admin@M365x72730749.onmicrosoft.com",
    "jobStatus": 5,
    "countryOrRegion": "Netherlands",
    "managementMode": 1,
    "tenants": [
      {
        "id": "1b4ae51c-dd98-4d48-bdf2-c2b7e87b912e",
        "name": "M365x72730749"
      },
      {
        "id": "e048876f-a4d7-4d5a-8b71-b3049e8933fe",
        "name": "M365x72034420"
      }
    ]
  },
  {
    "id": "5e67eb3a-b12f-46a4-a228-5b3eb0cf6cc4",
    "organization": "SimuSoft",
    "ownerEmail": "admin@M365x21996255.onmicrosoft.com",
    "jobStatus": 1,
    "countryOrRegion": "Netherlands",
    "managementMode": 1,
    "tenants": [
      {
        "id": "9107dec9-be73-4b88-aaf8-55e6d36b6e2e",
        "name": "M365x17022821"
      },
      {
        "id": "d4ec54a2-10a2-4bb3-a9fe-007f50e6ffa2",
        "name": "M365x21996255"
      }
    ]
  }
]
```

## Customer services (batch)
- request: `POST /partner/external/v3/general/customers/services/batch`
- result: ✅ HTTP 200 (4847 ms)

```json
[
  {
    "customerId": "4af7ac06-e9fb-43ea-a181-c34deba9c7e8",
    "organization": "AvePoint",
    "customer": "admin@M365x72730749.onmicrosoft.com",
    "products": [
      {
        "service": "tyGraph - Copilot",
        "subscriptionModel": "N/A",
        "purchasedUserSeats": "20",
        "purchasedUnits": "N/A",
        "microsoftLicenseAssigned": "N/A",
        "microsoftLicenseAvailable": "N/A",
        "purchasedCapacity": "N/A",
        "protectedCapacity": "N/A",
        "storage": "N/A",
        "retention": "N/A",
        "consumedStorage": "N/A",
        "expirationDate": "03-14-2026T12:00:00Z",
        "change": "N/A",
        "source": "AvePoint subscription",
        "paymentType": "N/A",
        "subscriptionName": "N/A",
        "package": "N/A",
        "contractEndDate": "N/A"
      },
      {
        "service": "tyGraph - Power BI Embedded",
        "subscriptionModel": "N/A",
        "purchasedUserSeats": "3",
        "purchasedUnits": "N/A",
        "microsoftLicenseAssigned": "N/A",
        "microsoftLicenseAvailable": "N/A",
        "purchasedCapacity": "N/A",
        "protectedCapacity": "N/A",
        "storage": "N/A",
        "retention": "N/A",
        "consumedStorage": "N/A",
        "expirationDate": "03-14-2026T12:00:00Z",
        "change": "N/A",
        "source": "AvePoint subscription",
        "paymentType": "N/A",
        "subscriptionName": "N/A",
        "package": "N/A",
        "contractEndDate": "N/A"
      },
      {
        "service": "tyGraph - Microsoft",
        "subscriptionModel": "N/A",
        "purchasedUserSeats": "20",
        "purchasedUnits": "N/A",
        "microsoftLicenseAssigned": "1",
        "microsoftLicenseAvailable": "0",
        "purchasedCapacity": "N/A",
        "protectedCapacity": "N/A",
        "storage": "N/A",
        "retention": "N/A",
        "consumedStorage": "N/A",
        "expirationDate": "03-14-2026T12:00:00Z",
        "change": "N/A",
        "source": "AvePoint subscription",
        "paymentType": "N/A",
        "subscriptionName": "N/A",
        "package": "N/A",
        "contractEndDate": "N/A"
      },
      {
        "service": "Cloud Governance",
        "subscriptionModel": "N/A",
        "purchasedUserSeats": "20",
        "purchasedUnits": "N/A",
        "microsoftLicenseAssigned": "0",
        "microsoftLicenseAvailable": "0",
        "purchasedCapacity": "N/A",
        "protectedCapacity": "N/A",
        "storage": "N/A",
        "retention": "N/A",
        "consumedStorage": "N/A",
        "expirationDate": "03-14-2026T12:00:00Z",
        "change": "N/A",
        "source": "AvePoint subscription",
        "paymentType": "N/A",
        "subscriptionName": "N/A",
        "package": "N/A",
        "contractEndDate": "N/A"
      },
      {
        "service": "Insights for Microsoft 365",
        "subscriptionModel": "Standard",
        "purchasedUserSeats": "20",
        "purchasedUnits": "N/A",
        "microsoftLicenseAssigned": "N/A",
        "microsoftLicenseAvailable": "N/A",
        "purchasedCapacity": "N/A",
        "protectedCapacity": "N/A",
        "storage": "N/A",
        "retention": "N/A",
        "consumedStorage": "N/A",
        "expirationDate": "03-14-2026T12:00:00Z",
        "change": "N/A",
        "source": "AvePoint subscription",
        "paymentType": "N/A",
        "subscriptionName": "N/A",
        "package": "N/A",
        "contractEndDate": "N/A"
      },
      {
        "service": "Cloud Backup for Microsoft 365 - Microsoft 365 services",
        "subscriptionModel": "Unlimited organizations",
        "purchasedUserSeats": "20",
        "purchasedUnits": "N/A",
        "microsoftLicenseAssigned": "0",
        "microsoftLicenseAvailable": "0",
        "purchasedCapacity": "N/A",
        "protectedCapacity": "N/A",
        "storage": "AvePoint storage (Microsoft Azure Blob)",
        "retention": "Unlimited retention",
        "consumedStorage": "N/A",
        "expirationDate": "03-14-2026T12:00:00Z",
        "change": "N/A",
        "source": "AvePoint subscription",
        "paymentType": "N/A",
        "subscriptionName": "N/A",
        "package": "Standard",
        "contractEndDate": "N/A"
      },
      {
        "service": "Cloud Backup for Microsoft 365 - Power Platform",
        "subscriptionModel": "Unlimited organizations",
        "purchasedUserSeats": "20",
        "purchasedUnits": "N/A",
        "microsoftLicenseAssigned": "0",
        "microsoftLicenseAvailable": "0",
        "purchasedCapacity": "N/A",
        "protectedCapacity": "N/A",
        "storage": "AvePoint storage (Microsoft Azure Blob)",
        "retention": "Unlimited retention",
        "consumedStorage": "N/A",
        "expirationDate": "03-14-2026T12:00:00Z",
        "change": "N/A",
        "source": "AvePoint subscription",
        "paymentType": "N/A",
        "subscriptionName": "N/A",
        "package": "N/A",
        "contractEndDate": "N/A"
      },
      {
        "service": "EnPower",
        "subscriptionModel": "N/A",
        "purchasedUserSeats": "20",
        "purchasedUnits": "N/A",
        "microsoftLicenseAssigned": "0",
        "microsoftLicenseAvailable": "0",
        "purchasedCapacity": "N/A",
        "protectedCapacity": "N/A",
        "storage": "AvePoint storage",
        "retention": "N/A",
        "consumedStorage": "N/A",
        "expirationDate": "03-15-2026T12:00:00Z",
        "change": "N/A",
        "source": "AvePoint subscription",
        "paymentType": "N/A",
        "subscriptionName": "N/A",
        "package": "N/A",
        "contractEndDate": "N/A"
      },
      {
        "service": "Cense",
        "subscriptionModel": "N/A",
        "purchasedUserSeats": "20",
        "purchasedUnits": "N/A",
        "microsoftLicenseAssigned": "0",
        "microsoftLicenseAvailable": "0",
        "purchasedCapacity": "N/A",
        "protectedCapacity": "N/A",
        "storage": "N/A",
        "retention": "N/A",
        "consumedStorage": "N/A",
        "expirationDate": "03-14-2026T12:00:00Z",
        "change": "N/A",
        "source": "AvePoint subscription",
        "paymentType": "N/A",
        "subscriptionName": "N/A",
        "package": "N/A",
        "contractEndDate": "N/A"
      },
      {
        "service": "Fly Aviator",
        "subscriptionModel": "N/A",
        "purchasedUserSeats": "N/A",
        "purchasedUnits": "N/A",
        "microsoftLicenseAssigned": "0",
        "microsoftLicenseAvailable": "0",
        "purchasedCapacity": "1044 GB",
        "protectedCapacity": "N/A",
        "storage": "N/A",
        "retention": "N/A",
        "consumedStorage": "N/A",
        "expirationDate": "03-14-2026T12:00:00Z",
        "change": "N/A",
        "source": "AvePoint subscription",
        "paymentType": "N/A",
        "subscriptionName": "N/A",
        "package": "N/A",
        "contractEndDate": "N/A"
      },
      {
        "service": "Fly Migration",
        "subscriptionModel": "N/A",
        "purchasedUserSeats": "20",
        "purchasedUnits": "N/A",
        "microsoftLicenseAssigned": "0",
        "microsoftLicenseAvailable": "0",
        "purchasedCapacity": "N/A",
        "protectedCapacity": "N/A",
        "storage": "N/A",
        "retention": "N/A",
        "consumedStorage": "N/A",
        "expirationDate": "03-14-2026T12:00:00Z",
        "change": "N/A",
        "source": "AvePoint subscription",
        "paymentType": "N/A",
        "subscriptionName": "N/A",
        "package": "N/A",
        "contractEndDate": "N/A"
      },
      {
        "service": "Opus - Information Lifecycle for Microsoft 365",
        "subscriptionModel": "N/A",
        "purchasedUserSeats": "20",
        "purchasedUnits": "N/A",
        "microsoftLicenseAssigned": "0",
        "microsoftLicenseAvailable": "0",
        "purchasedCapacity": "N/A",
        "protectedCapacity": "N/A",
        "storage": "AvePoint storage",
        "retention": "N/A",
        "consumedStorage": "N/A",
        "expirationDate": "03-14-2026T12:00:00Z",
        "change": "N/A",
        "source": "AvePoint subscription",
        "paymentType": "N/A",
        "subscriptionName": "N/A",
        "package": "N/A",
        "contractEndDate": "N/A"
      },
      {
        "service": "Opus - Storage optimization",
        "subscriptionModel": "Action and store",
        "purchasedUserSeats": "N/A",
        "purchasedUnits": "N/A",
        "microsoftLicenseAssigned": "N/A",
        "microsoftLicenseAvailable": "N/A",
        "purchasedCapacity": "1024 GB",
        "protectedCapacity": "N/A",
        "storage": "AvePoint storage",
        "retention": "N/A",
        "consumedStorage": "N/A",
        "expirationDate": "03-14-2026T12:00:00Z",
        "change": "N/A",
        "source": "AvePoint subscription",
        "paymentType": "N/A",
        "subscriptionName": "N/A",
        "package": "N/A",
        "contractEndDate": "N/A"
      },
      {
        "service": "Opus - Discovery and analysis for Microsoft 365",
        "subscriptionModel": "N/A",
        "purchasedUserSeats": "N/A",
        "purchasedUnits": "N/A",
        "microsoftLicenseAssigned": "N/A",
        "microsoftLicenseAvailable": "N/A",
        "purchasedCapacity": "1024 GB",
        "protectedCapacity": "N/A",
        "storage": "AvePoint storage",
        "retention": "N/A",
        "consumedStorage": "N/A",
        "expirationDate": "03-14-2026T12:00:00Z",
        "change": "N/A",
        "source": "AvePoint subscription",
        "paymentType": "N/A",
        "subscriptionName": "N/A",
        "package": "N/A",
        "contractEndDate": "N/A"
      },
      {
        "service": "Cloud Management",
        "subscriptionModel": "N/A",
        "purchasedUserSeats": "20",
        "purchasedUnits": "N/A",
        "microsoftLicenseAssigned": "0",
        "microsoftLicenseAvailable": "0",
        "purchasedCapacity": "N/A",
        "protectedCapacity": "N/A",
        "storage": "N/A",
        "retention": "N/A",
        "consumedStorage": "N/A",
        "expirationDate": "03-14-2026T12:00:00Z",
        "change": "N/A",
        "source": "AvePoint subscription",
        "paymentType": "N/A",
        "subscriptionName": "N/A",
        "package": "N/A",
        "contractEndDate": "N/A"
      },
      {
        "service": "Policies for Microsoft 365",
        "subscriptionModel": "N/A",
        "purchasedUserSeats": "20",
        "purchasedUnits": "N/A",
        "microsoftLicenseAssigned": "0",
        "microsoftLicenseAvailable": "0",
        "purchasedCapacity": "N/A",
        "protectedCapacity": "N/A",
        "storage": "N/A",
        "retention": "N/A",
        "consumedStorage": "N/A",
        "expirationDate": "03-14-2026T12:00:00Z",
        "change": "N/A",
        "source": "AvePoint subscription",
        "paymentType": "N/A",
        "subscriptionName": "N/A",
        "package": "N/A",
        "contractEndDate": "N/A"
      },
      {
        "service": "MyHub",
        "subscriptionModel": "N/A",
        "purchasedUserSeats": "20",
        "purchasedUnits": "N/A",
        "microsoftLicenseAssigned": "0",
        "microsoftLicenseAvailable": "0",
        "purchasedCapacity": "N/A",
        "protectedCapacity": "N/A",
        "storage": "N/A",
        "retention": "N/A",
        "consumedStorage": "N/A",
        "expirationDate": "03-14-2026T12:00:00Z",
        "change": "N/A",
        "source": "AvePoint subscription",
        "paymentType": "N/A",
        "subscriptionName": "N/A",
        "package": "N/A",
        "contractEndDate": "N/A"
      }
    ]
  },
  {
    "customerId": "5e67eb3a-b12f-46a4-a228-5b3eb0cf6cc4",
    "organization": "SimuSoft",
    "customer": "admin@M365x21996255.onmicrosoft.com",
    "products": [
      {
        "service": "Cloud Backup for Microsoft 365 - Microsoft 365 services",
        "subscriptionModel": "Unlimited organizations",
        "purchasedUserSeats": "20",
        "purchasedUnits": "N/A",
        "microsoftLicenseAssigned": "0",
        "microsoftLicenseAvailable": "20",
        "purchasedCapacity": "N/A",
        "protectedCapacity": "N/A",
        "storage": "AvePoint storage (Microsoft Azure Blob)",
        "retention": "Unlimited retention",
        "consumedStorage": "1.42 GB",
        "expirationDate": "02-27-2026T12:00:00Z",
        "change": "N/A",
        "source": "AvePoint pooled subscription",
        "paymentType": "Prepaid",
        "subscriptionName": "N/A",
        "package": "Standard",
        "contractEndDate": "N/A"
      },
      {
        "service": "User and device management",
        "subscriptionModel": "N/A",
        "purchasedUserSeats": "20",
        "purchasedUnits": "N/A",
        "microsoftLicenseAssigned": "0",
        "microsoftLicenseAvailable": "20",
        "purchasedCapacity": "N/A",
        "protectedCapacity": "N/A",
        "storage": "N/A",
        "retention": "N/A",
        "consumedStorage": "N/A",
        "expirationDate": "02-27-2026T12:00:00Z",
        "change": "N/A",
        "source": "AvePoint pooled subscription",
        "paymentType": "Prepaid",
        "subscriptionName": "N/A",
        "package": "N/A",
        "contractEndDate": "N/A"
      },
      {
        "service": "Workspace management",
        "subscriptionModel": "N/A",
        "purchasedUserSeats": "20",
        "purchasedUnits": "N/A",
        "microsoftLicenseAssigned": "0",
        "microsoftLicenseAvailable": "20",
        "purchasedCapacity": "N/A",
        "protectedCapacity": "N/A",
        "storage": "N/A",
        "retention": "N/A",
        "consumedStorage": "N/A",
        "expirationDate": "02-28-2026T12:00:00Z",
        "change": "N/A",
        "source": "AvePoint pooled subscription",
        "paymentType": "Prepaid",
        "subscriptionName": "N/A",
        "package": "N/A",
        "contractEndDate": "N/A"
      },
      {
        "service": "Baseline management",
        "subscriptionModel": "N/A",
        "purchasedUserSeats": "N/A",
        "purchasedUnits": "1",
        "microsoftLicenseAssigned": "N/A",
        "microsoftLicenseAvailable": "N/A",
        "purchasedCapacity": "N/A",
        "protectedCapacity": "N/A",
        "storage": "N/A",
        "retention": "N/A",
        "consumedStorage": "N/A",
        "expirationDate": "02-28-2026T12:00:00Z",
        "change": "N/A",
        "source": "AvePoint pooled subscription",
        "paymentType": "Prepaid",
        "subscriptionName": "N/A",
        "package": "N/A",
        "contractEndDate": "N/A"
      }
    ]
  }
]
```

## Baselines (batch)
- request: `POST /partner/external/v3/bm/baselines/batch`
- result: ✅ HTTP 200 (713 ms)

```json
[
  {
    "baselineId": "c691625c-0f81-0075-1f4e-08de38ae7de0",
    "baselineName": "Groups",
    "createdTime": "2025-12-11T12:12:02Z",
    "modifiedTime": "2025-12-11T12:12:02Z",
    "status": 5
  },
  {
    "baselineId": "68bd3cd0-4329-f0ee-6e4e-3a1d4651077f",
    "baselineName": "Demo Baseline Elements",
    "createdTime": "2025-10-30T08:02:58Z",
    "modifiedTime": "2025-12-11T10:17:51Z",
    "status": 3
  }
]
```

## Cloud Backup M365 overview (customer 4af7ac06-e9fb-43ea-a181-c34deba9c7e8)
- request: `GET /partner/external/v3/general/customers/4af7ac06-e9fb-43ea-a181-c34deba9c7e8/cloud-backup-m365/overview`
- result: ✅ HTTP 200 (5340 ms)

```json
[
  {
    "customerId": "4af7ac06-e9fb-43ea-a181-c34deba9c7e8",
    "customer": "admin@M365x72730749.onmicrosoft.com",
    "serviceType": "Cloud Backup for Microsoft 365",
    "serviceModule": "Exchange Online",
    "totalScannedObjects": 0,
    "totalProtectedObjects": 0,
    "dataSizeStoredInAvePoint": "0.01 GB",
    "dataSizeStoredInBYOS": "N/A"
  },
  {
    "customerId": "4af7ac06-e9fb-43ea-a181-c34deba9c7e8",
    "customer": "admin@M365x72730749.onmicrosoft.com",
    "serviceType": "Cloud Backup for Microsoft 365",
    "serviceModule": "Microsoft 365 Group",
    "totalScannedObjects": 3,
    "totalProtectedObjects": 0,
    "dataSizeStoredInAvePoint": "0.08 GB",
    "dataSizeStoredInBYOS": "N/A"
  }
]
```

## Jobs (customer 4af7ac06-e9fb-43ea-a181-c34deba9c7e8) page 1
- request: `POST /partner/external/v3/general/customers/4af7ac06-e9fb-43ea-a181-c34deba9c7e8/avpt-products/jobs/batch`
- result: ✅ HTTP 200 (1016 ms)

```json
[
  {
    "jobType": 0,
    "jobModule": 0,
    "status": 4,
    "jobId": "N/A",
    "name": "N/A",
    "totalCount": "N/A",
    "failedCount": "N/A",
    "successfulCount": "N/A",
    "skippedCount": "N/A",
    "warningCount": "N/A",
    "backupSize": "N/A",
    "startTime": "N/A",
    "endTime": "N/A",
    "jobDuration": "N/A",
    "lastModifyTime": "N/A"
  },
  {
    "jobType": 7,
    "jobModule": 302,
    "status": 2,
    "jobId": "IB20251211225226018075",
    "name": "N/A",
    "totalCount": "0",
    "failedCount": "0",
    "successfulCount": "0",
    "skippedCount": "0",
    "warningCount": "0",
    "backupSize": "0 GB",
    "startTime": "2025-12-11T22:52:30Z",
    "endTime": "2025-12-11T22:52:30Z",
    "jobDuration": "0 S",
    "lastModifyTime": "2025-12-11T22:52:32Z"
  }
]
```

## Jobs (customer 4af7ac06-e9fb-43ea-a181-c34deba9c7e8) page 2
- request: `POST /partner/external/v3/general/customers/4af7ac06-e9fb-43ea-a181-c34deba9c7e8/avpt-products/jobs/batch`
- result: ✅ HTTP 200 (963 ms)

```json
[]
```

## AvePoint product overview (customer 4af7ac06-e9fb-43ea-a181-c34deba9c7e8) type=2048
- request: `GET /partner/external/v3/general/customers/4af7ac06-e9fb-43ea-a181-c34deba9c7e8/avpt-products/type/2048/overview`
- result: ✅ HTTP 200 (675 ms)

```json
{
  "productType": 2048,
  "purchasedUserSeat": 20
}
```

## AvePoint product overview (customer 4af7ac06-e9fb-43ea-a181-c34deba9c7e8) type=40
- request: `GET /partner/external/v3/general/customers/4af7ac06-e9fb-43ea-a181-c34deba9c7e8/avpt-products/type/40/overview`
- result: ✅ HTTP 200 (665 ms)

```json
{
  "productType": 40,
  "purchasedUserSeat": 0
}
```

## AvePoint product overview (customer 4af7ac06-e9fb-43ea-a181-c34deba9c7e8) type=42
- request: `GET /partner/external/v3/general/customers/4af7ac06-e9fb-43ea-a181-c34deba9c7e8/avpt-products/type/42/overview`
- result: ✅ HTTP 200 (734 ms)

```json
{
  "productType": 42,
  "purchasedUserSeat": 0
}
```

## AvePoint product overview (customer 4af7ac06-e9fb-43ea-a181-c34deba9c7e8) type=49
- request: `GET /partner/external/v3/general/customers/4af7ac06-e9fb-43ea-a181-c34deba9c7e8/avpt-products/type/49/overview`
- result: ✅ HTTP 200 (611 ms)

```json
{
  "productType": 49,
  "purchasedUserSeat": 0
}
```

## Cloud Backup M365 overview (customer 5e67eb3a-b12f-46a4-a228-5b3eb0cf6cc4)
- request: `GET /partner/external/v3/general/customers/5e67eb3a-b12f-46a4-a228-5b3eb0cf6cc4/cloud-backup-m365/overview`
- result: ✅ HTTP 200 (4227 ms)

```json
[
  {
    "customerId": "5e67eb3a-b12f-46a4-a228-5b3eb0cf6cc4",
    "customer": "admin@M365x21996255.onmicrosoft.com",
    "serviceType": "Cloud Backup for Microsoft 365",
    "serviceModule": "Exchange Online",
    "totalScannedObjects": 45,
    "totalProtectedObjects": 45,
    "dataSizeStoredInAvePoint": "0.10 GB",
    "dataSizeStoredInBYOS": "N/A"
  },
  {
    "customerId": "5e67eb3a-b12f-46a4-a228-5b3eb0cf6cc4",
    "customer": "admin@M365x21996255.onmicrosoft.com",
    "serviceType": "Cloud Backup for Microsoft 365",
    "serviceModule": "Microsoft 365 Group",
    "totalScannedObjects": 0,
    "totalProtectedObjects": 0,
    "dataSizeStoredInAvePoint": "0 GB",
    "dataSizeStoredInBYOS": "N/A"
  }
]
```

## Jobs (customer 5e67eb3a-b12f-46a4-a228-5b3eb0cf6cc4) page 1
- request: `POST /partner/external/v3/general/customers/5e67eb3a-b12f-46a4-a228-5b3eb0cf6cc4/avpt-products/jobs/batch`
- result: ✅ HTTP 200 (1032 ms)

```json
[
  {
    "jobType": 0,
    "jobModule": 0,
    "status": 2,
    "jobId": "N/A",
    "name": "N/A",
    "totalCount": "N/A",
    "failedCount": "N/A",
    "successfulCount": "N/A",
    "skippedCount": "N/A",
    "warningCount": "N/A",
    "backupSize": "N/A",
    "startTime": "N/A",
    "endTime": "N/A",
    "jobDuration": "N/A",
    "lastModifyTime": "N/A"
  },
  {
    "jobType": 7,
    "jobModule": 302,
    "status": 2,
    "jobId": "IB20251211231744781867",
    "name": "N/A",
    "totalCount": "18",
    "failedCount": "0",
    "successfulCount": "18",
    "skippedCount": "0",
    "warningCount": "0",
    "backupSize": "0 GB",
    "startTime": "2025-12-11T23:17:55Z",
    "endTime": "2025-12-11T23:20:28Z",
    "jobDuration": "2m33s",
    "lastModifyTime": "2025-12-11T23:20:29Z"
  }
]
```

## Jobs (customer 5e67eb3a-b12f-46a4-a228-5b3eb0cf6cc4) page 2
- request: `POST /partner/external/v3/general/customers/5e67eb3a-b12f-46a4-a228-5b3eb0cf6cc4/avpt-products/jobs/batch`
- result: ✅ HTTP 200 (1042 ms)

```json
[]
```

## AvePoint product overview (customer 5e67eb3a-b12f-46a4-a228-5b3eb0cf6cc4) type=2048
- request: `GET /partner/external/v3/general/customers/5e67eb3a-b12f-46a4-a228-5b3eb0cf6cc4/avpt-products/type/2048/overview`
- result: ✅ HTTP 200 (610 ms)

```json
{
  "productType": 2048,
  "purchasedUserSeat": 20
}
```

## AvePoint product overview (customer 5e67eb3a-b12f-46a4-a228-5b3eb0cf6cc4) type=40
- request: `GET /partner/external/v3/general/customers/5e67eb3a-b12f-46a4-a228-5b3eb0cf6cc4/avpt-products/type/40/overview`
- result: ✅ HTTP 200 (664 ms)

```json
{
  "productType": 40,
  "purchasedUserSeat": 1
}
```

## AvePoint product overview (customer 5e67eb3a-b12f-46a4-a228-5b3eb0cf6cc4) type=42
- request: `GET /partner/external/v3/general/customers/5e67eb3a-b12f-46a4-a228-5b3eb0cf6cc4/avpt-products/type/42/overview`
- result: ✅ HTTP 200 (629 ms)

```json
{
  "productType": 42,
  "purchasedUserSeat": 20
}
```

## AvePoint product overview (customer 5e67eb3a-b12f-46a4-a228-5b3eb0cf6cc4) type=49
- request: `GET /partner/external/v3/general/customers/5e67eb3a-b12f-46a4-a228-5b3eb0cf6cc4/avpt-products/type/49/overview`
- result: ✅ HTTP 200 (632 ms)

```json
{
  "productType": 49,
  "purchasedUserSeat": 20
}
```

## Cloud Backup M365 overview (customer 634565d4-3b63-4cf4-8890-12fdb4ba95a1)
- request: `GET /partner/external/v3/general/customers/634565d4-3b63-4cf4-8890-12fdb4ba95a1/cloud-backup-m365/overview`
- result: ✅ HTTP 200 (732 ms)

```json
[]
```

## Jobs (customer 634565d4-3b63-4cf4-8890-12fdb4ba95a1) page 1
- request: `POST /partner/external/v3/general/customers/634565d4-3b63-4cf4-8890-12fdb4ba95a1/avpt-products/jobs/batch`
- result: ✅ HTTP 200 (1007 ms)

```json
[]
```

## AvePoint product overview (customer 634565d4-3b63-4cf4-8890-12fdb4ba95a1) type=2048
- request: `GET /partner/external/v3/general/customers/634565d4-3b63-4cf4-8890-12fdb4ba95a1/avpt-products/type/2048/overview`
- result: ✅ HTTP 200 (645 ms)

```json
{
  "productType": 2048,
  "purchasedUserSeat": 0
}
```

## AvePoint product overview (customer 634565d4-3b63-4cf4-8890-12fdb4ba95a1) type=40
- request: `GET /partner/external/v3/general/customers/634565d4-3b63-4cf4-8890-12fdb4ba95a1/avpt-products/type/40/overview`
- result: ✅ HTTP 200 (651 ms)

```json
{
  "productType": 40,
  "purchasedUserSeat": 1
}
```

## AvePoint product overview (customer 634565d4-3b63-4cf4-8890-12fdb4ba95a1) type=42
- request: `GET /partner/external/v3/general/customers/634565d4-3b63-4cf4-8890-12fdb4ba95a1/avpt-products/type/42/overview`
- result: ✅ HTTP 200 (645 ms)

```json
{
  "productType": 42,
  "purchasedUserSeat": 1
}
```

## AvePoint product overview (customer 634565d4-3b63-4cf4-8890-12fdb4ba95a1) type=49
- request: `GET /partner/external/v3/general/customers/634565d4-3b63-4cf4-8890-12fdb4ba95a1/avpt-products/type/49/overview`
- result: ✅ HTTP 200 (659 ms)

```json
{
  "productType": 49,
  "purchasedUserSeat": 0
}
```

## Cloud Backup M365 overview (customer 84f83a7f-c004-4303-b7c1-f011ac61235f)
- request: `GET /partner/external/v3/general/customers/84f83a7f-c004-4303-b7c1-f011ac61235f/cloud-backup-m365/overview`
- result: ✅ HTTP 200 (4519 ms)

```json
[
  {
    "customerId": "84f83a7f-c004-4303-b7c1-f011ac61235f",
    "customer": "admin@mockmsp.onmicrosoft.com",
    "serviceType": "Cloud Backup for Microsoft 365",
    "serviceModule": "Exchange Online",
    "totalScannedObjects": 5,
    "totalProtectedObjects": 5,
    "dataSizeStoredInAvePoint": "0.01 GB",
    "dataSizeStoredInBYOS": "N/A"
  },
  {
    "customerId": "84f83a7f-c004-4303-b7c1-f011ac61235f",
    "customer": "admin@mockmsp.onmicrosoft.com",
    "serviceType": "Cloud Backup for Microsoft 365",
    "serviceModule": "Microsoft 365 Group",
    "totalScannedObjects": 2,
    "totalProtectedObjects": 2,
    "dataSizeStoredInAvePoint": "0.01 GB",
    "dataSizeStoredInBYOS": "N/A"
  }
]
```

## Jobs (customer 84f83a7f-c004-4303-b7c1-f011ac61235f) page 1
- request: `POST /partner/external/v3/general/customers/84f83a7f-c004-4303-b7c1-f011ac61235f/avpt-products/jobs/batch`
- result: ✅ HTTP 200 (1053 ms)

```json
[
  {
    "jobType": 0,
    "jobModule": 0,
    "status": 2,
    "jobId": "N/A",
    "name": "N/A",
    "totalCount": "N/A",
    "failedCount": "N/A",
    "successfulCount": "N/A",
    "skippedCount": "N/A",
    "warningCount": "N/A",
    "backupSize": "N/A",
    "startTime": "N/A",
    "endTime": "N/A",
    "jobDuration": "N/A",
    "lastModifyTime": "N/A"
  },
  {
    "jobType": 7,
    "jobModule": 302,
    "status": 2,
    "jobId": "IB20251212151851560100",
    "name": "N/A",
    "totalCount": "5",
    "failedCount": "0",
    "successfulCount": "5",
    "skippedCount": "0",
    "warningCount": "0",
    "backupSize": "0 GB",
    "startTime": "2025-12-12T15:18:51Z",
    "endTime": "2025-12-12T15:19:30Z",
    "jobDuration": "38s",
    "lastModifyTime": "2025-12-12T15:19:30Z"
  }
]
```

## Jobs (customer 84f83a7f-c004-4303-b7c1-f011ac61235f) page 2
- request: `POST /partner/external/v3/general/customers/84f83a7f-c004-4303-b7c1-f011ac61235f/avpt-products/jobs/batch`
- result: ✅ HTTP 200 (973 ms)

```json
[]
```

## AvePoint product overview (customer 84f83a7f-c004-4303-b7c1-f011ac61235f) type=2048
- request: `GET /partner/external/v3/general/customers/84f83a7f-c004-4303-b7c1-f011ac61235f/avpt-products/type/2048/overview`
- result: ✅ HTTP 200 (762 ms)

```json
{
  "productType": 2048,
  "purchasedUserSeat": 1
}
```

## AvePoint product overview (customer 84f83a7f-c004-4303-b7c1-f011ac61235f) type=40
- request: `GET /partner/external/v3/general/customers/84f83a7f-c004-4303-b7c1-f011ac61235f/avpt-products/type/40/overview`
- result: ✅ HTTP 200 (636 ms)

```json
{
  "productType": 40,
  "purchasedUserSeat": 1
}
```

## AvePoint product overview (customer 84f83a7f-c004-4303-b7c1-f011ac61235f) type=42
- request: `GET /partner/external/v3/general/customers/84f83a7f-c004-4303-b7c1-f011ac61235f/avpt-products/type/42/overview`
- result: ✅ HTTP 200 (622 ms)

```json
{
  "productType": 42,
  "purchasedUserSeat": 1
}
```

## AvePoint product overview (customer 84f83a7f-c004-4303-b7c1-f011ac61235f) type=49
- request: `GET /partner/external/v3/general/customers/84f83a7f-c004-4303-b7c1-f011ac61235f/avpt-products/type/49/overview`
- result: ✅ HTTP 200 (623 ms)

```json
{
  "productType": 49,
  "purchasedUserSeat": 1
}
```

## Cloud Backup M365 overview (customer c6c00759-1e03-4332-bba4-01af15711929)
- request: `GET /partner/external/v3/general/customers/c6c00759-1e03-4332-bba4-01af15711929/cloud-backup-m365/overview`
- result: ✅ HTTP 200 (4073 ms)

```json
[
  {
    "customerId": "c6c00759-1e03-4332-bba4-01af15711929",
    "customer": "admin@M365x03696368.onmicrosoft.com",
    "serviceType": "Cloud Backup for Microsoft 365",
    "serviceModule": "Exchange Online",
    "totalScannedObjects": 26,
    "totalProtectedObjects": 26,
    "dataSizeStoredInAvePoint": "0.10 GB",
    "dataSizeStoredInBYOS": "N/A"
  },
  {
    "customerId": "c6c00759-1e03-4332-bba4-01af15711929",
    "customer": "admin@M365x03696368.onmicrosoft.com",
    "serviceType": "Cloud Backup for Microsoft 365",
    "serviceModule": "Microsoft 365 Group",
    "totalScannedObjects": 0,
    "totalProtectedObjects": 0,
    "dataSizeStoredInAvePoint": "0 GB",
    "dataSizeStoredInBYOS": "N/A"
  }
]
```

## Jobs (customer c6c00759-1e03-4332-bba4-01af15711929) page 1
- request: `POST /partner/external/v3/general/customers/c6c00759-1e03-4332-bba4-01af15711929/avpt-products/jobs/batch`
- result: ✅ HTTP 200 (999 ms)

```json
[
  {
    "jobType": 0,
    "jobModule": 0,
    "status": 2,
    "jobId": "N/A",
    "name": "N/A",
    "totalCount": "N/A",
    "failedCount": "N/A",
    "successfulCount": "N/A",
    "skippedCount": "N/A",
    "warningCount": "N/A",
    "backupSize": "N/A",
    "startTime": "N/A",
    "endTime": "N/A",
    "jobDuration": "N/A",
    "lastModifyTime": "N/A"
  },
  {
    "jobType": 7,
    "jobModule": 302,
    "status": 2,
    "jobId": "IB20251211224826913432",
    "name": "N/A",
    "totalCount": "19",
    "failedCount": "0",
    "successfulCount": "19",
    "skippedCount": "0",
    "warningCount": "0",
    "backupSize": "0 GB",
    "startTime": "2025-12-11T22:48:27Z",
    "endTime": "2025-12-11T22:49:19Z",
    "jobDuration": "52s",
    "lastModifyTime": "2025-12-11T22:49:20Z"
  }
]
```

## Jobs (customer c6c00759-1e03-4332-bba4-01af15711929) page 2
- request: `POST /partner/external/v3/general/customers/c6c00759-1e03-4332-bba4-01af15711929/avpt-products/jobs/batch`
- result: ✅ HTTP 200 (988 ms)

```json
[]
```

## AvePoint product overview (customer c6c00759-1e03-4332-bba4-01af15711929) type=2048
- request: `GET /partner/external/v3/general/customers/c6c00759-1e03-4332-bba4-01af15711929/avpt-products/type/2048/overview`
- result: ✅ HTTP 200 (738 ms)

```json
{
  "productType": 2048,
  "purchasedUserSeat": 1
}
```

## AvePoint product overview (customer c6c00759-1e03-4332-bba4-01af15711929) type=40
- request: `GET /partner/external/v3/general/customers/c6c00759-1e03-4332-bba4-01af15711929/avpt-products/type/40/overview`
- result: ✅ HTTP 200 (997 ms)

```json
{
  "productType": 40,
  "purchasedUserSeat": 1
}
```

## AvePoint product overview (customer c6c00759-1e03-4332-bba4-01af15711929) type=42
- request: `GET /partner/external/v3/general/customers/c6c00759-1e03-4332-bba4-01af15711929/avpt-products/type/42/overview`
- result: ✅ HTTP 200 (641 ms)

```json
{
  "productType": 42,
  "purchasedUserSeat": 1
}
```

## AvePoint product overview (customer c6c00759-1e03-4332-bba4-01af15711929) type=49
- request: `GET /partner/external/v3/general/customers/c6c00759-1e03-4332-bba4-01af15711929/avpt-products/type/49/overview`
- result: ✅ HTTP 200 (1354 ms)

```json
{
  "productType": 49,
  "purchasedUserSeat": 1
}
```

## Cloud Backup M365 overview (customer e3168506-3fa7-4ed6-9e40-8ddb5cb3683a)
- request: `GET /partner/external/v3/general/customers/e3168506-3fa7-4ed6-9e40-8ddb5cb3683a/cloud-backup-m365/overview`
- result: ✅ HTTP 200 (5417 ms)

```json
[
  {
    "customerId": "e3168506-3fa7-4ed6-9e40-8ddb5cb3683a",
    "customer": "yawegi3063@comsb.com",
    "serviceType": "Cloud Backup for Microsoft 365",
    "serviceModule": "Exchange Online",
    "totalScannedObjects": 24,
    "totalProtectedObjects": 24,
    "dataSizeStoredInAvePoint": "0.84 GB",
    "dataSizeStoredInBYOS": "N/A"
  },
  {
    "customerId": "e3168506-3fa7-4ed6-9e40-8ddb5cb3683a",
    "customer": "yawegi3063@comsb.com",
    "serviceType": "Cloud Backup for Microsoft 365",
    "serviceModule": "Microsoft 365 Group",
    "totalScannedObjects": 0,
    "totalProtectedObjects": 0,
    "dataSizeStoredInAvePoint": "0.96 GB",
    "dataSizeStoredInBYOS": "N/A"
  }
]
```

## Jobs (customer e3168506-3fa7-4ed6-9e40-8ddb5cb3683a) page 1
- request: `POST /partner/external/v3/general/customers/e3168506-3fa7-4ed6-9e40-8ddb5cb3683a/avpt-products/jobs/batch`
- result: ✅ HTTP 200 (1029 ms)

```json
[
  {
    "jobType": 0,
    "jobModule": 0,
    "status": 2,
    "jobId": "N/A",
    "name": "N/A",
    "totalCount": "N/A",
    "failedCount": "N/A",
    "successfulCount": "N/A",
    "skippedCount": "N/A",
    "warningCount": "N/A",
    "backupSize": "N/A",
    "startTime": "N/A",
    "endTime": "N/A",
    "jobDuration": "N/A",
    "lastModifyTime": "N/A"
  },
  {
    "jobType": 7,
    "jobModule": 302,
    "status": 2,
    "jobId": "IB20251212191631888693",
    "name": "N/A",
    "totalCount": "5",
    "failedCount": "0",
    "successfulCount": "5",
    "skippedCount": "0",
    "warningCount": "0",
    "backupSize": "0 GB",
    "startTime": "2025-12-12T19:16:31Z",
    "endTime": "2025-12-12T19:16:33Z",
    "jobDuration": "2s",
    "lastModifyTime": "2025-12-12T19:16:33Z"
  }
]
```

## Jobs (customer e3168506-3fa7-4ed6-9e40-8ddb5cb3683a) page 2
- request: `POST /partner/external/v3/general/customers/e3168506-3fa7-4ed6-9e40-8ddb5cb3683a/avpt-products/jobs/batch`
- result: ✅ HTTP 200 (984 ms)

```json
[]
```

## AvePoint product overview (customer e3168506-3fa7-4ed6-9e40-8ddb5cb3683a) type=2048
- request: `GET /partner/external/v3/general/customers/e3168506-3fa7-4ed6-9e40-8ddb5cb3683a/avpt-products/type/2048/overview`
- result: ✅ HTTP 200 (612 ms)

```json
{
  "productType": 2048,
  "purchasedUserSeat": 50
}
```

## AvePoint product overview (customer e3168506-3fa7-4ed6-9e40-8ddb5cb3683a) type=40
- request: `GET /partner/external/v3/general/customers/e3168506-3fa7-4ed6-9e40-8ddb5cb3683a/avpt-products/type/40/overview`
- result: ✅ HTTP 200 (638 ms)

```json
{
  "productType": 40,
  "purchasedUserSeat": 25
}
```

## AvePoint product overview (customer e3168506-3fa7-4ed6-9e40-8ddb5cb3683a) type=42
- request: `GET /partner/external/v3/general/customers/e3168506-3fa7-4ed6-9e40-8ddb5cb3683a/avpt-products/type/42/overview`
- result: ✅ HTTP 200 (632 ms)

```json
{
  "productType": 42,
  "purchasedUserSeat": 25
}
```

## AvePoint product overview (customer e3168506-3fa7-4ed6-9e40-8ddb5cb3683a) type=49
- request: `GET /partner/external/v3/general/customers/e3168506-3fa7-4ed6-9e40-8ddb5cb3683a/avpt-products/type/49/overview`
- result: ✅ HTTP 200 (615 ms)

```json
{
  "productType": 49,
  "purchasedUserSeat": 25
}
```

## Cloud Backup M365 overview (customer d0fa5a48-0864-494e-86f5-c9120bb7ad72)
- request: `GET /partner/external/v3/general/customers/d0fa5a48-0864-494e-86f5-c9120bb7ad72/cloud-backup-m365/overview`
- result: ✅ HTTP 200 (4868 ms)

```json
[
  {
    "customerId": "d0fa5a48-0864-494e-86f5-c9120bb7ad72",
    "customer": "Roche.Mahomedradja@avepointdbn.onmicrosoft.com",
    "serviceType": "Cloud Backup for Microsoft 365",
    "serviceModule": "Exchange Online",
    "totalScannedObjects": 81,
    "totalProtectedObjects": 81,
    "dataSizeStoredInAvePoint": "143.22 GB",
    "dataSizeStoredInBYOS": "N/A"
  },
  {
    "customerId": "d0fa5a48-0864-494e-86f5-c9120bb7ad72",
    "customer": "Roche.Mahomedradja@avepointdbn.onmicrosoft.com",
    "serviceType": "Cloud Backup for Microsoft 365",
    "serviceModule": "Microsoft 365 Group",
    "totalScannedObjects": 159,
    "totalProtectedObjects": 142,
    "dataSizeStoredInAvePoint": "96.34 GB",
    "dataSizeStoredInBYOS": "N/A"
  }
]
```

## Jobs (customer d0fa5a48-0864-494e-86f5-c9120bb7ad72) page 1
- request: `POST /partner/external/v3/general/customers/d0fa5a48-0864-494e-86f5-c9120bb7ad72/avpt-products/jobs/batch`
- result: ✅ HTTP 200 (1195 ms)

```json
[
  {
    "jobType": 0,
    "jobModule": 0,
    "status": 2,
    "jobId": "N/A",
    "name": "N/A",
    "totalCount": "N/A",
    "failedCount": "N/A",
    "successfulCount": "N/A",
    "skippedCount": "N/A",
    "warningCount": "N/A",
    "backupSize": "N/A",
    "startTime": "N/A",
    "endTime": "N/A",
    "jobDuration": "N/A",
    "lastModifyTime": "N/A"
  },
  {
    "jobType": 7,
    "jobModule": 302,
    "status": 4,
    "jobId": "IB20251212141532723365",
    "name": "N/A",
    "totalCount": "2430",
    "failedCount": "7",
    "successfulCount": "2412",
    "skippedCount": "11",
    "warningCount": "0",
    "backupSize": "0 GB",
    "startTime": "2025-12-12T14:15:32Z",
    "endTime": "2025-12-12T15:29:03Z",
    "jobDuration": "1h13m30s",
    "lastModifyTime": "2025-12-12T15:29:03Z"
  }
]
```

## Jobs (customer d0fa5a48-0864-494e-86f5-c9120bb7ad72) page 2
- request: `POST /partner/external/v3/general/customers/d0fa5a48-0864-494e-86f5-c9120bb7ad72/avpt-products/jobs/batch`
- result: ✅ HTTP 200 (1985 ms)

```json
[
  {
    "jobType": 12,
    "jobModule": 360,
    "status": 2,
    "jobId": "FB20251212060037683",
    "name": "AVP UK",
    "totalCount": "16",
    "failedCount": "0",
    "successfulCount": "16",
    "skippedCount": "0",
    "warningCount": "0",
    "backupSize": "0.01 GB",
    "startTime": "2025-12-12T06:00:35Z",
    "endTime": "2025-12-12T06:07:56Z",
    "jobDuration": "7m20s",
    "lastModifyTime": "2025-12-12T17:02:39Z"
  },
  {
    "jobType": 12,
    "jobModule": 360,
    "status": 2,
    "jobId": "FB20251212170027275",
    "name": "Demo - FR",
    "totalCount": "16",
    "failedCount": "0",
    "successfulCount": "14",
    "skippedCount": "2",
    "warningCount": "0",
    "backupSize": "0.01 GB",
    "startTime": "2025-12-12T17:00:27Z",
    "endTime": "2025-12-12T17:02:32Z",
    "jobDuration": "2m4s",
    "lastModifyTime": "2025-12-12T17:02:39Z"
  }
]
```

## AvePoint product overview (customer d0fa5a48-0864-494e-86f5-c9120bb7ad72) type=2048
- request: `GET /partner/external/v3/general/customers/d0fa5a48-0864-494e-86f5-c9120bb7ad72/avpt-products/type/2048/overview`
- result: ✅ HTTP 200 (659 ms)

```json
{
  "productType": 2048,
  "purchasedUserSeat": 100
}
```

## AvePoint product overview (customer d0fa5a48-0864-494e-86f5-c9120bb7ad72) type=40
- request: `GET /partner/external/v3/general/customers/d0fa5a48-0864-494e-86f5-c9120bb7ad72/avpt-products/type/40/overview`
- result: ✅ HTTP 200 (1341 ms)

```json
{
  "productType": 40,
  "purchasedUserSeat": 1
}
```

## AvePoint product overview (customer d0fa5a48-0864-494e-86f5-c9120bb7ad72) type=42
- request: `GET /partner/external/v3/general/customers/d0fa5a48-0864-494e-86f5-c9120bb7ad72/avpt-products/type/42/overview`
- result: ✅ HTTP 200 (803 ms)

```json
{
  "productType": 42,
  "purchasedUserSeat": 62
}
```

## AvePoint product overview (customer d0fa5a48-0864-494e-86f5-c9120bb7ad72) type=49
- request: `GET /partner/external/v3/general/customers/d0fa5a48-0864-494e-86f5-c9120bb7ad72/avpt-products/type/49/overview`
- result: ✅ HTTP 200 (648 ms)

```json
{
  "productType": 49,
  "purchasedUserSeat": 62
}
```

## Cloud Backup M365 overview (customer ab123777-31db-4525-b7eb-abe4140a48d6)
- request: `GET /partner/external/v3/general/customers/ab123777-31db-4525-b7eb-abe4140a48d6/cloud-backup-m365/overview`
- result: ✅ HTTP 200 (3620 ms)

```json
[
  {
    "customerId": "ab123777-31db-4525-b7eb-abe4140a48d6",
    "customer": "admin@M365x72457424.onmicrosoft.com",
    "serviceType": "Cloud Backup for Microsoft 365",
    "serviceModule": "Exchange Online",
    "totalScannedObjects": 24,
    "totalProtectedObjects": 24,
    "dataSizeStoredInAvePoint": "0.10 GB",
    "dataSizeStoredInBYOS": "N/A"
  },
  {
    "customerId": "ab123777-31db-4525-b7eb-abe4140a48d6",
    "customer": "admin@M365x72457424.onmicrosoft.com",
    "serviceType": "Cloud Backup for Microsoft 365",
    "serviceModule": "Microsoft 365 Group",
    "totalScannedObjects": 0,
    "totalProtectedObjects": 0,
    "dataSizeStoredInAvePoint": "0 GB",
    "dataSizeStoredInBYOS": "N/A"
  }
]
```

## Jobs (customer ab123777-31db-4525-b7eb-abe4140a48d6) page 1
- request: `POST /partner/external/v3/general/customers/ab123777-31db-4525-b7eb-abe4140a48d6/avpt-products/jobs/batch`
- result: ✅ HTTP 200 (995 ms)

```json
[
  {
    "jobType": 0,
    "jobModule": 0,
    "status": 2,
    "jobId": "N/A",
    "name": "N/A",
    "totalCount": "N/A",
    "failedCount": "N/A",
    "successfulCount": "N/A",
    "skippedCount": "N/A",
    "warningCount": "N/A",
    "backupSize": "N/A",
    "startTime": "N/A",
    "endTime": "N/A",
    "jobDuration": "N/A",
    "lastModifyTime": "N/A"
  },
  {
    "jobType": 7,
    "jobModule": 302,
    "status": 2,
    "jobId": "IB20251211231230879120",
    "name": "N/A",
    "totalCount": "19",
    "failedCount": "0",
    "successfulCount": "19",
    "skippedCount": "0",
    "warningCount": "0",
    "backupSize": "0 GB",
    "startTime": "2025-12-11T23:12:30Z",
    "endTime": "2025-12-11T23:24:18Z",
    "jobDuration": "11m48s",
    "lastModifyTime": "2025-12-11T23:24:19Z"
  }
]
```

## Jobs (customer ab123777-31db-4525-b7eb-abe4140a48d6) page 2
- request: `POST /partner/external/v3/general/customers/ab123777-31db-4525-b7eb-abe4140a48d6/avpt-products/jobs/batch`
- result: ✅ HTTP 200 (1023 ms)

```json
[]
```

## AvePoint product overview (customer ab123777-31db-4525-b7eb-abe4140a48d6) type=2048
- request: `GET /partner/external/v3/general/customers/ab123777-31db-4525-b7eb-abe4140a48d6/avpt-products/type/2048/overview`
- result: ✅ HTTP 200 (654 ms)

```json
{
  "productType": 2048,
  "purchasedUserSeat": 1
}
```

## AvePoint product overview (customer ab123777-31db-4525-b7eb-abe4140a48d6) type=40
- request: `GET /partner/external/v3/general/customers/ab123777-31db-4525-b7eb-abe4140a48d6/avpt-products/type/40/overview`
- result: ✅ HTTP 200 (626 ms)

```json
{
  "productType": 40,
  "purchasedUserSeat": 1
}
```

## AvePoint product overview (customer ab123777-31db-4525-b7eb-abe4140a48d6) type=42
- request: `GET /partner/external/v3/general/customers/ab123777-31db-4525-b7eb-abe4140a48d6/avpt-products/type/42/overview`
- result: ✅ HTTP 200 (651 ms)

```json
{
  "productType": 42,
  "purchasedUserSeat": 1
}
```

## AvePoint product overview (customer ab123777-31db-4525-b7eb-abe4140a48d6) type=49
- request: `GET /partner/external/v3/general/customers/ab123777-31db-4525-b7eb-abe4140a48d6/avpt-products/type/49/overview`
- result: ✅ HTTP 200 (654 ms)

```json
{
  "productType": 49,
  "purchasedUserSeat": 1
}
```
