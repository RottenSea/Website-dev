// @ts-check
import { defineConfig } from 'astro/config';

import partytown from '@astrojs/partytown';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  integrations: [partytown(), react()],
  image: {
    service: {
      entrypoint: "astro/assets/services/noop",
    },
  },
});