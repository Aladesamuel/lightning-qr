# ⚡ Lightning QR API

A high-performance, lightweight QR code generation API built with Node.js and Fastify.

## Features
- **Ultra Fast**: Average latency of **< 30ms** (P99 < 50ms in most cases).
- **Lightweight**: Minimal dependencies, stateless generation.
- **Customizable**: Supports SVG, PNG, UTF8, custom colors, sizing, and margins.

## API Usage

### `GET /generate`

Generates a QR code based on the provided parameters.

#### Query Parameters
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `text` | `string` | **Required** | The content to encode in the QR code. |
| `format` | `png \| svg` | `png` | The output format. |
| `size` | `number` | `300` | Width/height in pixels (50-2000). |
| `margin` | `number` | `4` | Quiet zone size (0-20). |
| `color_dark` | `hex string` | `#000000` | Foreground color. |
| `color_light` | `hex string` | `#ffffff` | Background color. |
| `dots_type` | `string` | `square` | `square`, `dots`, `rounded`, `extra-rounded`, `classy`, `classy-rounded`. |
| `logo_url` | `url` | - | URL of an image to embed in the center. |
| `theme` | `string` | - | Preset themes: `modern`, `cyberpunk`, `classic`. |

#### Examples
- **Basic PNG**: `GET /generate?text=Hello`
- **Cyberpunk Theme**: `GET /generate?text=Hello&theme=cyberpunk`
- **SVG with Logo**: `GET /generate?text=Hello&format=svg&logo_url=https://example.com/logo.png`
- **Custom Dots**: `GET /generate?text=Hello&dots_type=rounded&color_dark=#1a73e8`

### `GET /health`
Returns `{ "status": "ok" }` to verify the service is running.

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start development server:
   ```bash
   npm run dev
   ```
3. Run tests:
   ```bash
   npm test
   ```
4. Run benchmark:
   ```bash
   npm run bench
   ```

## Performance Results
Benchmark results (100 sequential requests):
- **Avg Latency**: 28.75ms
- **P50**: 23.83ms
- **P95**: 46.43ms
- **Goal**: < 50ms (✅ Achieved)
