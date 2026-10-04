import { expect, test, type Page } from "@playwright/test";

/** Espera a que el preloader termine (la cortina se recoge) */
async function ready(page: Page) {
  await page.waitForSelector("#preloader", { state: "detached", timeout: 15_000 });
}

const isMobile = (page: Page) => (page.viewportSize()?.width ?? 1440) < 1024;

test.describe("Rutas e idiomas", () => {
  test("la raíz redirige al idioma preferido", async ({ browser }) => {
    const es = await browser.newContext({ locale: "es-PE" });
    const p1 = await es.newPage();
    await p1.goto("/");
    await expect(p1).toHaveURL(/\/es$/);
    const en = await browser.newContext({ locale: "en-US" });
    const p2 = await en.newPage();
    await p2.goto("/");
    await expect(p2).toHaveURL(/\/en$/);
    await es.close();
    await en.close();
  });

  test("slugs localizados y redirección de slug incorrecto", async ({ page }) => {
    await page.goto("/en/nosotros");
    await expect(page).toHaveURL(/\/en\/about$/);
    await expect(page.locator("h1")).toContainText("We create inspiring homes");
    await page.goto("/es/contact");
    await expect(page).toHaveURL(/\/es\/contacto$/);
  });

  test("cambio de idioma conserva la página", async ({ page }) => {
    await page.goto("/es/quiero-ser-distribuidor");
    await ready(page);
    if (isMobile(page)) {
      await page.getByRole("button", { name: "Menú" }).click();
      await page.locator("#top").page().getByRole("link", { name: "en", exact: true }).last().click();
    } else {
      await page.getByRole("link", { name: "en", exact: true }).first().click();
    }
    await expect(page).toHaveURL(/\/en\/become-a-distributor$/);
    await expect(page.locator("h1")).toContainText("Sell roller blinds");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });

  test("404 para rutas inexistentes", async ({ page }) => {
    const res = await page.goto("/es/no-existe");
    expect(res?.status()).toBe(404);
    await expect(page.getByText("404")).toBeVisible();
  });

  test("sitemap y robots", async ({ request }) => {
    const sm = await request.get("/sitemap.xml");
    expect(sm.ok()).toBeTruthy();
    expect(await sm.text()).toContain("/en/become-a-distributor");
    const rb = await request.get("/robots.txt");
    expect(await rb.text()).toContain("Sitemap");
  });
});

test.describe("Header y navegación", () => {
  test("megamenú de soluciones filtra el catálogo", async ({ page }) => {
    test.skip(isMobile(page), "solo escritorio");
    await page.goto("/es");
    await ready(page);
    await page.getByRole("button", { name: "Soluciones" }).hover();
    const panel = page.locator("header").getByRole("link", { name: /Motorización/ }).first();
    await expect(panel).toBeVisible();
    await panel.click();
    await expect(page).toHaveURL(/\/es\/productos\?c=motorizacion/);
    await expect(page.getByText("3 productos", { exact: true })).toBeVisible();
  });

  test("megamenú Nosotros lleva a la sección", async ({ page }) => {
    test.skip(isMobile(page), "solo escritorio");
    await page.goto("/es");
    await ready(page);
    await page.getByRole("button", { name: "Nosotros" }).click();
    await page.getByRole("link", { name: /Equipo/ }).first().click();
    await expect(page).toHaveURL(/\/es\/nosotros#equipo/);
  });

  test("menú móvil abre, despliega y navega", async ({ page }) => {
    test.skip(!isMobile(page), "solo móvil");
    await page.goto("/es");
    await ready(page);
    await page.getByRole("button", { name: "Menú" }).click();
    await page.getByRole("button", { name: "Soluciones" }).click();
    await page.getByRole("link", { name: "Telas" }).first().click();
    await expect(page).toHaveURL(/\/es\/productos\?c=telas/);
    await expect(page.getByText("11 productos", { exact: true })).toBeVisible();
  });

  test("header se vuelve sólido al hacer scroll", async ({ page }) => {
    await page.goto("/es");
    await ready(page);
    await page.mouse.wheel(0, 300);
    await expect(page.locator("header > div").nth(1)).toHaveClass(/bg-cream/);
  });
});

test.describe("Catálogo y cotización", () => {
  test("búsqueda, colores y envío de cotización", async ({ page }) => {
    await page.goto("/es/productos");
    await ready(page);
    await page.getByPlaceholder(/Buscar producto/).fill("blackout");
    await expect(page.getByText("3 productos", { exact: true })).toBeVisible();
    const card = page.locator("li", { hasText: "Tela Blackout Basic" });
    await card.getByRole("radio", { name: "Tan" }).click();
    await card.getByRole("button", { name: /Agregar a cotización/ }).click();
    await expect(page.getByRole("button", { name: /Cotización \(1\)/ })).toBeVisible();

    await page.getByRole("button", { name: /Ver cotización/ }).click();
    const dialog = page.getByRole("dialog", { name: "Tu cotización" });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText("Tela Blackout Basic")).toBeVisible();
    await expect(dialog.locator("select").first()).toHaveValue("tan");

    await dialog.getByRole("button", { name: /Solicitar cotización/ }).click();
    await expect(dialog.getByText("Este campo es obligatorio").first()).toBeVisible();

    await dialog.getByLabel(/Nombre y apellido/).fill("Prueba Distribuidor");
    await dialog.getByLabel(/Teléfono/).fill("+51 999 888 777");
    await dialog.getByLabel(/Correo electrónico/).fill("prueba@example.com");
    await dialog.locator('input[name="consent"]').check();
    await dialog.getByRole("button", { name: /Solicitar cotización/ }).click();
    await expect(dialog.getByText("¡Mensaje enviado!")).toBeVisible();
  });

  test("la lista de cotización persiste al recargar", async ({ page }) => {
    await page.goto("/es/productos?c=accesorios");
    await ready(page);
    await page.locator("li", { hasText: "Cadena plástica" }).getByRole("button", { name: /Agregar/ }).click();
    await page.reload();
    await ready(page);
    await expect(page.getByRole("button", { name: /Cotización \(1\)/ })).toBeVisible();
  });
});

test.describe("Formularios", () => {
  test("contacto: validación y envío", async ({ page }) => {
    await page.goto("/es/contacto");
    await ready(page);
    const form = page.getByRole("form", { name: "Contacto" });
    await form.getByRole("button", { name: "Enviar" }).click();
    await expect(form.getByText("Este campo es obligatorio").first()).toBeVisible();
    await form.getByLabel(/Nombre y apellido/).fill("Cliente Final");
    await form.getByLabel(/Correo electrónico/).fill("correo-invalido");
    await form.getByLabel(/Teléfono/).fill("999888777");
    await form.getByLabel("Soy *").selectOption({ index: 2 });
    await form.getByLabel(/Mensaje/).fill("Quisiera cotizar cortinas blackout para 3 ventanas.");
    await form.locator('input[name="consent"]').check();
    await form.getByRole("button", { name: "Enviar" }).click();
    await expect(form.getByText("Ingresa un correo válido")).toBeVisible();
    await form.getByLabel(/Correo electrónico/).fill("cliente@example.com");
    await form.getByRole("button", { name: "Enviar" }).click();
    await expect(page.getByText("¡Mensaje enviado!")).toBeVisible();
  });

  test("postulación de distribuidor", async ({ page }) => {
    await page.goto("/es/quiero-ser-distribuidor#postular");
    await ready(page);
    const form = page.getByRole("form", { name: "Distribuidor" });
    await form.getByLabel(/Nombre y apellido/).fill("Decoradora Prueba");
    await form.getByLabel(/Teléfono/).fill("+51 912 345 678");
    await form.getByLabel(/Correo electrónico/).fill("deco@example.com");
    await form.getByLabel(/Ciudad/).fill("Arequipa");
    await form.getByLabel("Perfil *").selectOption({ index: 1 });
    await form.getByLabel(/Experiencia/).selectOption({ index: 1 });
    await form.getByRole("button", { name: /Enviar postulación/ }).click();
    await expect(form.getByText("Debes aceptar la política de privacidad")).toBeVisible();
    await form.locator('input[name="consent"]').check();
    await form.getByRole("button", { name: /Enviar postulación/ }).click();
    await expect(page.getByText("¡Mensaje enviado!")).toBeVisible();
  });

  test("API valida y aplica honeypot", async ({ request }) => {
    const bad = await request.post("/api/contact", { data: { type: "contact", lang: "es", name: "A" } });
    expect(bad.status()).toBe(422);
    const bot = await request.post("/api/contact", { data: { website: "spam", type: "contact" } });
    expect((await bot.json()).ok).toBe(true);
  });
});

test.describe("Interacciones", () => {
  test("laboratorio de luz cambia métricas", async ({ page }) => {
    await page.goto("/es");
    await ready(page);
    const lab = page.locator("#laboratorio");
    await lab.scrollIntoViewIfNeeded();
    await lab.getByRole("radio", { name: "Blackout" }).click();
    await expect(lab.getByText("100%", { exact: true })).toBeVisible();
    await lab.getByRole("radio", { name: "Dúo" }).click();
    await lab.getByRole("button", { name: "Franjas cerradas" }).click();
    await expect(lab.getByText("99%", { exact: true })).toBeVisible();
    await lab.getByLabel("Altura de la cortina").fill("30");
    await expect(lab.getByText("30%", { exact: true })).toBeVisible();
  });

  test("video se reproduce al hacer clic", async ({ page }) => {
    await page.goto("/es");
    await ready(page);
    const btn = page.getByRole("button", { name: "Reproducir video" }).first();
    await btn.scrollIntoViewIfNeeded();
    await btn.click();
    await expect
      .poll(() => page.evaluate(() => [...document.querySelectorAll("video")].some((v) => !v.paused && v.currentTime > 0 && !v.loop)), { timeout: 15_000 })
      .toBe(true);
  });

  test("sin desbordamiento horizontal en ninguna página", async ({ page }) => {
    for (const path of ["/es", "/es/nosotros", "/es/productos", "/es/quiero-ser-distribuidor", "/es/contacto", "/en"]) {
      await page.goto(path);
      await ready(page);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, path).toBeLessThanOrEqual(0);
      // Elementos de contenido más anchos que la pantalla (aunque un contenedor los recorte)
      const wide = await page.evaluate(() =>
        [...document.querySelectorAll("main li, main article, main form, main h1, main h2, main p")]
          .filter((el) => el.getBoundingClientRect().width > window.innerWidth + 1)
          .map((el) => `${el.tagName}: ${el.textContent?.slice(0, 40)}`),
      );
      expect(wide, path).toEqual([]);
    }
  });

  test("WhatsApp apunta al número comercial", async ({ page }) => {
    await page.goto("/es");
    await ready(page);
    const href = await page.getByRole("link", { name: "Escríbenos" }).getAttribute("href");
    expect(href).toContain("wa.me/51981082480");
  });
});
