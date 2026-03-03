# SHANNON Web - AI Penetration Testing Framework

A fully functional web interface for the SHANNON AI penetration testing framework. This application provides an accessible, simplified interface for security teams to conduct authorized security testing without requiring CLI knowledge.

**IMPORTANT: This tool is designed exclusively for authorized security testing. Unauthorized use is illegal and unethical.**

## Features

- **Cyberpunk Minimal UI** - Stunning neon amber/orange aesthetic matching the hero image design
- **Real Scan Execution** - Executes actual security testing logic via Supabase Edge Functions
- **Multiple Security Modules**:
  - Reconnaissance (DNS, subdomain discovery)
  - OSINT (Open-source intelligence)
  - Web Vulnerability Scanning (OWASP Top 10, security headers)
  - LLM Injection Testing
  - AI Attack Surface Mapping
  - Prompt Injection Auditing
  - RAG Exploitation Testing

- **Authorization Gate** - Mandatory legal consent and authorization before any scan
- **Interactive Dashboard** - Monitor all scans with filtering and search
- **Detailed Results** - Risk scoring, severity breakdown, and comprehensive findings
- **Export Capabilities** - Export results to JSON or Markdown
- **Authentication** - Secure user authentication via Supabase Auth

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: TailwindCSS with custom cyberpunk theme
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **Authentication**: Supabase Auth (Email/Password)
- **Database**: PostgreSQL with Row Level Security
- **Icons**: Lucide React

## Database Schema

The application uses a comprehensive database schema:

- **consents** - Legal authorization records
- **scans** - Security scan configurations and status
- **scan_modules** - Module selection and results
- **findings** - Individual security vulnerabilities
- **reports** - Generated security reports
- **attack_paths** - Attack chain visualizations

All tables use Row Level Security (RLS) to ensure users can only access their own data.

## Setup Instructions

### Prerequisites

- Node.js 18+
- Supabase account
- Git

### Environment Variables

The following environment variables are already configured in `.env`:

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

### Installation

1. Install dependencies:
```bash
npm install
```

2. The database schema has already been applied via migrations

3. The Edge Function for scan execution is already deployed

4. Start the development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

## Usage

### Creating a Scan

1. Sign up or sign in to your account
2. Navigate to "New Scan"
3. Configure your target:
   - Enter target domain
   - (Optional) Enter target IP
   - Describe the scope
   - Select scan depth (Quick/Standard/Deep)
4. Select security modules to run
5. Click "Start Scan"
6. Provide authorization consent:
   - Organization name
   - Confirm written authorization
   - Accept legal responsibility
7. Monitor scan progress in the Dashboard
8. View results when complete

### Viewing Results

- Access the Dashboard to see all scans
- Filter by status (pending/running/completed/failed)
- Search by domain name
- Click on completed scans to view detailed results
- Export results to JSON or Markdown format

## Security Architecture

### Authorization Flow

1. User must provide explicit consent before any scan
2. Consent includes:
   - Organization name
   - Target domain
   - Confirmation of written authorization
   - Legal responsibility acceptance
3. All consents are logged with timestamps and IP addresses
4. No scan executes without valid consent

### Row Level Security

All database tables enforce RLS policies:
- Users can only view/modify their own records
- Scan data is isolated per user
- Authentication required for all operations

### Scan Execution

Scans execute via Supabase Edge Functions with:
- Real security testing logic (not mocked)
- DNS reconnaissance
- Security header analysis
- Subdomain discovery
- AI endpoint detection
- Vulnerability assessment

## Architecture

### Frontend Components

```
src/
├── components/
│   ├── auth/
│   │   └── AuthPage.tsx          # Authentication UI
│   ├── layout/
│   │   ├── Header.tsx            # Navigation header
│   │   └── Footer.tsx            # Footer component
│   ├── modals/
│   │   └── ConsentModal.tsx      # Authorization consent modal
│   ├── pages/
│   │   ├── LandingPage.tsx       # Hero and features
│   │   ├── DashboardPage.tsx     # Scan history and stats
│   │   ├── NewScanPage.tsx       # Scan builder
│   │   └── ScanResultPage.tsx    # Results display
│   └── ui/
│       ├── GlowButton.tsx        # Neon button component
│       ├── GlowCard.tsx          # Glassmorphism card
│       ├── NeonText.tsx          # Glowing text
│       ├── Badge.tsx             # Severity badges
│       ├── Input.tsx             # Form input
│       ├── Select.tsx            # Dropdown select
│       ├── Checkbox.tsx          # Checkbox input
│       ├── TextArea.tsx          # Text area input
│       └── LoadingSpinner.tsx    # Loading indicator
├── lib/
│   ├── supabase.ts               # Supabase client
│   └── database.types.ts         # TypeScript types
└── types/
    └── index.ts                  # Application types
```

### Backend (Supabase Edge Functions)

```
supabase/functions/
└── execute-scan/
    └── index.ts                  # Scan execution logic
```

## Security Testing Modules

### Recon Module
- DNS resolution
- Subdomain discovery
- Common subdomain enumeration

### Web Vulnerability Module
- Security header analysis
- X-Frame-Options detection
- HSTS verification
- Content Security Policy check
- X-Content-Type-Options validation

### LLM Injection Module
- AI endpoint detection
- Common LLM endpoint patterns
- Prompt injection risk assessment

### AI Attack Surface Module
- AI component exposure analysis
- Attack vector identification

### Prompt Injection Module
- System prompt protection assessment
- Input validation review

### RAG Exploitation Module
- RAG system security review
- Data sanitization checks

## Customization

### Adding New Modules

1. Add module to `AVAILABLE_MODULES` in `NewScanPage.tsx`
2. Implement module logic in `supabase/functions/execute-scan/index.ts`
3. Add case to `executeModule()` function
4. Deploy updated Edge Function

### Styling

The cyberpunk theme is configured in:
- `tailwind.config.js` - Color palette, shadows, animations
- `src/index.css` - Global styles, custom utilities
- Custom colors: `neon-orange`, `neon-amber`, `cyber-black`

## Legal Disclaimer

**CRITICAL: This tool is designed exclusively for authorized security testing.**

- Unauthorized security testing is illegal and unethical
- You MUST have explicit written authorization from the system owner
- All scans are logged and monitored
- Violations will be reported to appropriate authorities

By using SHANNON, you confirm that you have proper authorization and accept full legal responsibility for all security tests conducted.

## Contributing

This is a production-ready implementation of the SHANNON framework. Contributions should maintain:
- Security-first design
- Real execution (no mocked results)
- Legal compliance requirements
- Cyberpunk aesthetic consistency

## License

Use responsibly and only for authorized security testing.

## Support

For issues, questions, or security concerns, please refer to the original SHANNON framework:
https://github.com/KeygraphHQ/shannon

---

**Remember: With great power comes great responsibility. Use SHANNON ethically and legally.**
