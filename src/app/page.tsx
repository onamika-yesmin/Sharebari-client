import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>Next.js + TypeScript</p>
        <h1>ShareBari client is ready.</h1>
        <p className={styles.copy}>
          Start editing <code>src/app/page.tsx</code> to build your app.
        </p>
      </section>
    </main>
  );
}
