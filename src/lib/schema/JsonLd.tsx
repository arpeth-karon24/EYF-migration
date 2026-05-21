/**
 * Reusable JSON-LD injection component.
 *
 * Renders one <script type="application/ld+json"> tag. Safer than
 * inline templating in every page because it handles serialization and
 * escaping consistently.
 *
 * Use one per schema type on a page — Google and other search engines
 * are happy to parse multiple JSON-LD blocks per document.
 */
interface JsonLdProps {
  /** A Schema.org-compatible object. Will be JSON-stringified. */
  data: Record<string, unknown> | Array<Record<string, unknown>>;
  /** Optional ID for debugging / overriding. */
  id?: string;
}

export function JsonLd({ data, id }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      id={id}
      // eslint-disable-next-line react/no-danger -- JSON-LD must be raw HTML
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
    />
  );
}
