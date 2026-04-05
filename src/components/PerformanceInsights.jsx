export default function PerformanceInsights() {
  return (
    <aside className="insights-panel">
      <h3>Why This Version Is Faster</h3>
      <ul>
        <li>
          Story detail requests are resolved in parallel with Promise.all.
        </li>
        <li>
          Virtualization keeps rendered DOM nodes low for smoother interactions.
        </li>
        <li>
          Date formatting is reused through one Intl.DateTimeFormat instance.
        </li>
        <li>Only cherry-picked lodash modules are included in the bundle.</li>
      </ul>
    </aside>
  );
}
