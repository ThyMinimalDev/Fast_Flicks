import { SSTConfig } from 'sst'
import { NextjsSite } from 'sst/constructs'

export default {
  config(_input) {
    return {
      name: 'minkbd',
      region: 'eu-central-1',
      profile:
        _input.stage === 'production'
          ? process.env.PROFILE_PROD
          : process.env.PROFILE_DEV,
    }
  },
  stacks(app) {
    const domain =
      process.env.NEXT_PUBLIC_APP_URL?.replace('https://', '') ?? 'localhost:3000'
    app.stack(function Site({ stack }) {
      const site = new NextjsSite(stack, 'site', {
        customDomain: {
          domainName: stack.stage === 'production' ? domain : `${stack.stage}.${domain}`,
          domainAlias:
            stack.stage === 'production'
              ? `www.${domain}`
              : `www.${stack.stage}.${domain}`,
        },
        environment: {
          DIRECT_URL: process.env.DIRECT_URL ?? '',
          DATABASE_URL: process.env.DATABASE_URL ?? '',
          NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY ?? '',
          NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? '',
          NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
          NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
          NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
        },
      })
      stack.addOutputs({
        SiteUrl: site.url,
      })
    })
  },
} satisfies SSTConfig
