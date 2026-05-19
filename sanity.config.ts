import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemas } from './src/sanity/schemas';

export default defineConfig({
  name: 'engage-youth-web',
  title: 'Engage Youth Foundation',
  projectId: 'asmjcr3s',
  dataset: 'production',
  plugins: [structureTool(), visionTool()],
  schema: { types: schemas },
});
