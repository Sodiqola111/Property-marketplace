# PropertyMarket — Real Estate Marketplace Front-End

A professional responsive property marketplace demo built with **HTML5, CSS3 and vanilla JavaScript**.

## Pages

- `index.html` — homepage, search, featured/latest demo listings
- `properties.html` — filtering, sorting, grid/list view
- `property-details.html` — gallery, details, amenities, enquiry modal
- `list-property.html` — owner/agent listing form, image previews and preview modal
- `dashboard.html` — demo owner/agent dashboard
- `agents.html` — demo agent cards
- `agent-profile.html` — demo agent profile
- `about.html` — platform information
- `contact.html` — contact form
- `login.html` / `register.html` — authentication UI only

## Run

Open `index.html` in a browser. For best results, use a small local server (for example VS Code Live Server).

## Demo/data rules

All properties, agents, testimonials, prices, locations, IDs, dates and contact actions are illustrative. They are not claims about real properties or real people.

The JavaScript stores only non-sensitive demo state such as favourite property IDs and the listing form's illustrative data. **Do not store passwords or sensitive personal information in LocalStorage.**

## Suggested production architecture

A real deployment should add:

1. Secure authentication/session management.
2. Database for users, properties, images and enquiries.
3. Object/cloud storage for property images.
4. Agent/landlord verification and admin moderation.
5. Server-side validation and authorisation.
6. Real-time listing availability/status.
7. Email/WhatsApp notification services.
8. Google Maps or another map provider.
9. Payment processing and subscription plans where needed.
10. Admin dashboard, audit logs and security controls.
11. Search/filter APIs and pagination.
12. HTTPS, CSRF protection, rate limiting, secure password hashing and privacy controls.

## Folder structure

```text
property-marketplace/
├── index.html
├── properties.html
├── property-details.html
├── list-property.html
├── dashboard.html
├── agents.html
├── agent-profile.html
├── about.html
├── contact.html
├── login.html
├── register.html
├── css/
│   ├── style.css
│   ├── responsive.css
│   └── dashboard.css
├── js/
│   ├── app.js
│   └── properties.js
├── images/
│   ├── properties/
│   ├── agents/
│   ├── categories/
│   └── hero/
└── README.md
```
