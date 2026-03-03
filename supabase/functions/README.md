# Supabase Edge Functions Setup

## Send Booking Email Function

This function sends email notifications when a booking is created.

### Prerequisites

1. **Resend Account** - Sign up at [resend.com](https://resend.com)
2. **Supabase CLI** - Install with `npm install -g supabase`

### Setup Steps

1. **Get your Resend API Key**
   - Go to resend.com → API Keys → Create API Key
   - Copy the key (starts with `re_`)

2. **Login to Supabase CLI**
   ```bash
   supabase login
   ```

3. **Link your project**
   ```bash
   supabase link --project-ref dlqbiayaqjucxsvbesms
   ```

4. **Set the Resend API Key as a secret**
   ```bash
   supabase secrets set RESEND_API_KEY=re_your_api_key_here
   ```

5. **Deploy the function**
   ```bash
   supabase functions deploy send-booking-email
   ```

### Verify Domain (Optional but Recommended)

To send from `notifications@tutagora.com`:
1. Go to Resend → Domains → Add Domain
2. Add `tutagora.com`
3. Add the DNS records to your domain
4. Verify the domain

If you don't verify a domain, emails will come from `onboarding@resend.dev`

### Testing

After deployment, bookings should automatically trigger emails to:
- The tutor (notification of new booking)
- The student (booking confirmation)

### Troubleshooting

Check function logs:
```bash
supabase functions logs send-booking-email
```
