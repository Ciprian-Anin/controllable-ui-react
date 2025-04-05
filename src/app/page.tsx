import Image from 'next/image';

import { TableWithTooltipsDemo } from '@/demo/TableWithTooltipsDemo';
import { TooltipDemo } from '@/demo/TooltipDemo';
import { TooltipWithCloseActionDemo } from '@/demo/TooltipWithCloseActionDemo';

import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol>
          <li>
            Get started by editing <code>src/app/page.tsx</code>.
          </li>
          <li>Save and see your changes instantly.</li>
        </ol>

        <div className={styles.ctas}>
          <a
            className={styles.primary}
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className={styles.logo}
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.secondary}
          >
            Read our docs
          </a>
        </div>

        <h1>Basic Tooltip Demo</h1>
        <TooltipDemo
          preferredPlacement="bottom"
          placementStrategy="default"
          message={<div>Tada</div>}
        >
          <button>🎉</button>
        </TooltipDemo>

        <h1>Qwik Tooltip With Close Action Demo </h1>
        <TooltipWithCloseActionDemo
          placementStrategy="default"
          preferredPlacement="bottom"
          tooltipRootClass="QwikTooltipDemo-html-example"
        />

        <h1>Qwik Tooltip Demo 0</h1>
        <TooltipDemo
          placementStrategy="default"
          preferredPlacement="bottom"
          message={
            <span>
              <p style={{ fontSize: 16, fontWeight: "bold" }}>
                Tooltip with HTML
              </p>
              <p>
                <em>And here&apos;s</em> <b>some</b> <u>amazing content</u>.
                It&apos;s very engaging. Right?
              </p>
            </span>
          }
        >
          <button>HTML</button>
        </TooltipDemo>

        <h1>Qwik Tooltip Demo 1</h1>
        <div className="Root-demo-tooltip">
          <div className="top-section">
            <TooltipDemo
              preferredPlacement="top-start"
              placementStrategy="default"
              message={<div>Top start</div>}
            >
              <button>top-start</button>
            </TooltipDemo>
            <TooltipDemo
              preferredPlacement="top"
              placementStrategy="default"
              message={<div>Top</div>}
            >
              <button>top</button>
            </TooltipDemo>
            <TooltipDemo
              preferredPlacement="top-end"
              placementStrategy="default"
              message={<div>Top end</div>}
            >
              <button>top-end</button>
            </TooltipDemo>
          </div>

          <div className="left-section">
            <TooltipDemo
              preferredPlacement="left-start"
              placementStrategy="default"
              message={<div>Left start</div>}
            >
              <button>left-start</button>
            </TooltipDemo>
            <TooltipDemo
              preferredPlacement="left"
              placementStrategy="default"
              message={<div>Left</div>}
            >
              <button>left</button>
            </TooltipDemo>
            <TooltipDemo
              preferredPlacement="left-end"
              placementStrategy="default"
              message={<div>Left end</div>}
            >
              <button>left-end</button>
            </TooltipDemo>
          </div>

          <div className="right-section">
            <TooltipDemo
              preferredPlacement="right-start"
              placementStrategy="default"
              message={<div>Right start</div>}
            >
              <button>right-start</button>
            </TooltipDemo>
            <TooltipDemo
              preferredPlacement="right"
              placementStrategy="default"
              message={<div>Right</div>}
            >
              <button>right</button>
            </TooltipDemo>
            <TooltipDemo
              preferredPlacement="right-end"
              placementStrategy="default"
              message={<div>Right end</div>}
            >
              <button>right-end</button>
            </TooltipDemo>
          </div>

          <div className="bottom-section">
            <TooltipDemo
              preferredPlacement="bottom-start"
              placementStrategy="default"
              message={<div>Bottom start</div>}
            >
              <button>bottom-start</button>
            </TooltipDemo>
            <TooltipDemo
              preferredPlacement="bottom"
              placementStrategy="default"
              message={<div>Bottom</div>}
            >
              <button>bottom</button>
            </TooltipDemo>
            <TooltipDemo
              preferredPlacement="bottom-end"
              placementStrategy="default"
              message={<div>Bottom end</div>}
            >
              <button>bottom-end</button>
            </TooltipDemo>
          </div>
        </div>

        <h1>Qwik Tooltip Demo 2</h1>
        <div style={{ position: "relative", height: "100vh", width: "100%" }}>
          <div
            style={{
              position: "absolute",
              top: "10px",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            <TooltipDemo
              placementStrategy="default"
              preferredPlacement="top"
              message={<span>Top Tooltip</span>}
            >
              <button>Top</button>
            </TooltipDemo>
          </div>
          <div
            style={{
              position: "absolute",
              bottom: "10px",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            <TooltipDemo
              placementStrategy="default"
              preferredPlacement="bottom"
              message={<span>Bottom Tooltip</span>}
            >
              <button>Bottom</button>
            </TooltipDemo>
          </div>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "10px",
              transform: "translateY(-50%)",
            }}
          >
            <TooltipDemo
              placementStrategy="default"
              preferredPlacement="left"
              message={<span>Left Tooltip</span>}
            >
              <button>Left</button>
            </TooltipDemo>
          </div>
          <div
            style={{
              position: "absolute",
              top: "50%",
              right: "10px",
              transform: "translateY(-50%)",
            }}
          >
            <TooltipDemo
              placementStrategy="default"
              preferredPlacement="right"
              message={<span>Right Tooltip</span>}
            >
              <button>Right</button>
            </TooltipDemo>
          </div>
          <div style={{ position: "absolute", top: "10px", left: "10px" }}>
            <TooltipDemo
              placementStrategy="default"
              preferredPlacement="top-start"
              message={<span>Top Left Tooltip</span>}
            >
              <button>Top Left</button>
            </TooltipDemo>
          </div>
          <div style={{ position: "absolute", top: "10px", right: "10px" }}>
            <TooltipDemo
              placementStrategy="default"
              preferredPlacement="top-end"
              message={<span>Top Right Tooltip</span>}
            >
              <button>Top Right</button>
            </TooltipDemo>
          </div>
          <div style={{ position: "absolute", bottom: "10px", left: "10px" }}>
            <TooltipDemo
              placementStrategy="default"
              preferredPlacement="bottom-start"
              message={<span>Bottom Left Tooltip</span>}
            >
              <button>Bottom Left</button>
            </TooltipDemo>
          </div>
          <div style={{ position: "absolute", bottom: "10px", right: "10px" }}>
            <TooltipDemo
              placementStrategy="default"
              preferredPlacement="bottom-end"
              message={<span>Bottom Right Tooltip</span>}
            >
              <button>Bottom Right</button>
            </TooltipDemo>
          </div>
        </div>

        <h1>Qwik Tooltip Demo 3</h1>
        <div
          className="QwikTooltipDemo-grid"
          style={{ overflow: "auto", width: "100%", height: "100vh" }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(4, auto)`,
              gridAutoRows: "auto",
              gap: "90px",
              padding: "10px",
            }}
          >
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} style={{ position: "relative" }}>
                <TooltipDemo
                  placementStrategy="default"
                  preferredPlacement="bottom"
                  message={
                    <span>
                      {i + 1} Lorem ipsum dolor sit amet, consectetur adipiscing
                      elit.
                    </span>
                  }
                >
                  <button>Cell {i + 1}</button>
                </TooltipDemo>
              </div>
            ))}
          </div>
        </div>
        <h1>Qwik Tooltip Table Demo</h1>
        <TableWithTooltipsDemo />
      </main>
      <footer className={styles.footer}>
        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
