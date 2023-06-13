import { defineConfig } from 'cypress';
import getCompareSnapshotsPlugin from "cypress-visual-regression/dist/plugin";

export default defineConfig({
  env: {
    screenshotsFolder: './cypress/snapshots/actual',
    trashAssetsBeforeRuns: true,
    video: false,
  },
  e2e: {
    baseUrl: 'http://localhost:5173',
    setupNodeEvents(on, config) {
      getCompareSnapshotsPlugin(on, config);
    },
  },
});
