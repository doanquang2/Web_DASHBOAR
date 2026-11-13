/* DỮ LIỆU BÀI VIẾT KIẾN THỨC
   Muốn thêm bài mới: copy một khối { ... } bên dưới, đổi slug (chỉ chữ thường, số, dấu gạch ngang),
   category (plc | hmi | bien-tan | esp32-iot | cam-bien | dien-cong-nghiep), tiêu đề, tóm tắt và nội dung.
   Nội dung (body) viết bằng HTML: <h2>, <p>, <ul>, <ol>, <pre><code>, <table>, <div class="callout">. */
window.ARTICLES = [

{
  slug: 'mach-tu-giu-plc',
  category: 'plc',
  title: 'Mạch tự giữ trong PLC: vì sao nhả nút START mà động cơ vẫn chạy?',
  summary: 'Giải thích từng bước bằng chương trình thực tế, kèm lỗi hay gặp khi đấu nút STOP thường đóng.',
  minutes: 6,
  body: `
<p>Mạch tự giữ (seal-in) là mạch đầu tiên bạn nên nắm chắc khi học PLC. Bấm START một lần, động cơ chạy liên tục dù đã nhả tay. Bấm STOP thì động cơ dừng. Gần như mọi chương trình điều khiển phức tạp hơn đều xây dựng từ ý tưởng này.</p>

<h2>Ý tưởng cốt lõi</h2>
<p>Ta dùng chính ngõ ra Y0 để "giữ" mình. Một tiếp điểm của Y0 được mắc song song với nút START. Khi Y0 có điện, tiếp điểm này đóng lại và tiếp tục cấp điện cho cuộn Y0, kể cả khi bạn đã nhả nút START.</p>

<h2>Gán địa chỉ (ví dụ PLC Mitsubishi FX)</h2>
<ul>
  <li><code>X0</code>: nút START (thường hở)</li>
  <li><code>X1</code>: nút STOP</li>
  <li><code>Y0</code>: cuộn contactor của động cơ</li>
</ul>

<h2>Chương trình dạng danh sách lệnh</h2>
<pre><code>LD   X0     ; nút START
OR   Y0     ; song song với tiếp điểm tự giữ
AND  X1     ; nối tiếp với nút STOP
OUT  Y0     ; xuất ra contactor</code></pre>
<p>Đọc từ trên xuống: động cơ được chạy khi (START bấm hoặc Y0 đang chạy) và STOP chưa bị bấm. Vì STOP nối tiếp nên nó luôn "thắng": nếu bấm START và STOP cùng lúc, động cơ không chạy.</p>

<div class="callout callout-warn">
  <p><strong>Lỗi hay gặp nhất: nút STOP.</strong> Ngoài tủ điện, nút STOP thường là loại <em>thường đóng</em> (NC) để khi đứt dây thì máy dừng, an toàn hơn. Khi chưa bấm, ngõ vào X1 <em>có điện</em> (ON), nên trong chương trình dùng <code>AND X1</code> như trên. Nếu bạn lỡ đấu nút STOP loại thường hở thì phải đổi thành <code>ANI X1</code>, nếu không động cơ sẽ không bao giờ chạy hoặc không bao giờ dừng.</p>
</div>

<h2>Kiểm tra từng bước</h2>
<ol>
  <li>Bấm START: đèn Y0 sáng, động cơ chạy.</li>
  <li>Nhả START: Y0 vẫn sáng. Đây là lúc tiếp điểm tự giữ làm việc.</li>
  <li>Bấm STOP: Y0 tắt.</li>
  <li>Nhả STOP: Y0 phải vẫn tắt, không tự chạy lại.</li>
</ol>
<p>Nên chạy thử bằng đèn báo hoặc giả lập trước khi nối động cơ thật.</p>

<div class="callout">
  <p><strong>An toàn:</strong> nút dừng khẩn cấp phải cắt điện bằng phần cứng (cắt trực tiếp nguồn cuộn contactor), không chỉ là một ngõ vào của chương trình PLC. Chương trình có thể treo hoặc lỗi, còn mạch phần cứng thì không.</p>
</div>
`
},

{
  slug: 'timer-plc-mitsubishi-fx',
  category: 'plc',
  title: 'Timer trong PLC Mitsubishi FX: đặt thời gian đúng và tránh 3 lỗi phổ biến',
  summary: 'Cách tính giá trị K, ví dụ trễ bật ngõ ra 5 giây và những lỗi khiến timer chạy sai.',
  minutes: 5,
  body: `
<p>Timer cho phép bạn trễ việc bật một ngõ ra, ví dụ chờ 5 giây sau khi bấm nút rồi mới chạy băng tải, hoặc cho đèn cảnh báo sáng trước khi khởi động động cơ.</p>

<h2>Độ phân giải của timer</h2>
<p>Với dòng PLC Mitsubishi FX thông dụng, độ phân giải phụ thuộc vào số hiệu timer:</p>
<table>
  <thead><tr><th>Timer</th><th>Đơn vị thời gian</th><th>Ví dụ</th></tr></thead>
  <tbody>
    <tr><td>T0 đến T199</td><td>100 ms</td><td><code>K50</code> = 5 giây</td></tr>
    <tr><td>T200 đến T245</td><td>10 ms</td><td><code>K500</code> = 5 giây</td></tr>
  </tbody>
</table>
<p>Công thức: thời gian = giá trị K nhân với đơn vị. Giá trị K tối đa là 32767.</p>

<h2>Ví dụ: trễ bật Y0 sau 5 giây</h2>
<pre><code>LD   X0         ; nút bấm
OUT  T0 K50     ; timer T0, đếm 50 x 100 ms = 5 giây
LD   T0         ; tiếp điểm T0 đóng khi đếm đủ
OUT  Y0         ; bật ngõ ra</code></pre>
<p>Khi X0 đang ON liên tục đủ 5 giây, tiếp điểm T0 đóng và Y0 bật. Nhả X0 trước đủ 5 giây thì timer về 0 và Y0 không bật.</p>

<h2>3 lỗi phổ biến</h2>
<ol>
  <li><strong>Dùng trùng số timer.</strong> Hai lệnh <code>OUT T0</code> ở hai chỗ khác nhau sẽ tranh nhau điều khiển cùng một timer, kết quả khó đoán. Mỗi timer chỉ dùng một lần.</li>
  <li><strong>Điều kiện đầu vào bị ngắt giữa chừng.</strong> Timer thường sẽ reset về 0 mỗi khi điều kiện đầu vào mất. Nếu cần nhớ thời gian đã đếm, hãy chọn loại timer tích lũy mà dòng PLC của bạn hỗ trợ (xem tài liệu của đúng model).</li>
  <li><strong>Nhầm đơn vị.</strong> Đặt <code>K5</code> với timer 100 ms thì chỉ là 0,5 giây chứ không phải 5 giây. Luôn tính lại bằng công thức trước khi nạp.</li>
</ol>

<div class="callout">
  <p><strong>Mẹo:</strong> ghi chú giá trị thời gian ngay cạnh lệnh (ví dụ <code>; 5 giây</code>) để sau này người khác đọc lại chương trình không phải tính lại.</p>
</div>
`
},

{
  slug: 'ket-noi-hmi-voi-plc',
  category: 'hmi',
  title: 'Kết nối HMI với PLC: kiểm tra theo thứ tự này sẽ tiết kiệm nhiều giờ',
  summary: 'Danh sách kiểm tra khi HMI không nhận PLC, và cách dùng nút HMI đúng để điều khiển ngõ ra.',
  minutes: 7,
  body: `
<p>HMI hiện "mất kết nối" hay "lỗi truyền thông" là tình huống ai cũng gặp lần đầu. Thay vì đoán, hãy kiểm tra lần lượt theo danh sách dưới đây.</p>

<h2>Danh sách kiểm tra khi HMI không nhận PLC</h2>
<ol>
  <li><strong>Cáp và cổng.</strong> Đúng chuẩn truyền thông (RS232, RS422 hay RS485) và đúng chân. Cáp tự làm rất hay sai thứ tự chân.</li>
  <li><strong>Thông số truyền thông giống nhau ở hai phía.</strong> Tốc độ truyền (baudrate), số bit dữ liệu, parity, số bit dừng. Chỉ cần lệch một thông số là không nói chuyện được.</li>
  <li><strong>Số trạm (station).</strong> Số trạm của PLC trong HMI phải khớp với số trạm cài trong PLC.</li>
  <li><strong>Đúng dòng PLC trong phần mềm HMI.</strong> Chọn sai driver là nguyên nhân khá phổ biến khi vừa đổi sang hãng hoặc đời PLC khác.</li>
  <li><strong>Đúng địa chỉ thiết bị.</strong> Địa chỉ vùng nhớ phải nằm trong phạm vi mà PLC đó có.</li>
</ol>

<h2>Nút bấm trên HMI nên điều khiển cái gì?</h2>
<p>Ngõ vào vật lý (X) do tín hiệu bên ngoài quyết định, bạn không ghi vào nó từ HMI được. Cách làm chuẩn là cho nút HMI ghi vào một <strong>relay nội bộ</strong> (ví dụ M0), rồi dùng M0 trong chương trình PLC.</p>
<p>Lấy lại mạch tự giữ, cho phép khởi động từ cả nút vật lý X0 lẫn nút trên HMI (M0):</p>
<pre><code>LD   X0     ; nút START ngoài tủ
OR   M0     ; hoặc nút START trên HMI
OR   Y0     ; tự giữ
AND  X1     ; nút STOP
OUT  Y0</code></pre>

<h2>Chọn đúng kiểu nút</h2>
<ul>
  <li><strong>Momentary (nhấn giữ):</strong> có điện khi đang nhấn, nhả ra thì mất. Phù hợp START, STOP, JOG.</li>
  <li><strong>Set / Reset:</strong> bật hoặc tắt hẳn một bit.</li>
  <li><strong>Toggle (đảo):</strong> mỗi lần nhấn đổi trạng thái. Tiện nhưng dễ gây hiểu nhầm khi chương trình PLC cũng thay đổi bit đó.</li>
</ul>

<h2>Hiển thị trạng thái thật</h2>
<p>Đèn "Động cơ đang chạy" trên HMI nên đọc từ ngõ ra Y0 (hoặc tín hiệu phản hồi thật), không đọc từ bit lệnh M0. Bit lệnh cho biết bạn <em>muốn</em> chạy, còn Y0 mới cho biết PLC <em>đang</em> chạy. Hai thứ này khác nhau khi có lỗi hoặc khi STOP đang bị bấm.</p>

<div class="callout">
  <p><strong>Trước khi chạy thật:</strong> thử toàn bộ nút và đèn trên HMI khi chưa nối tải. Chỉ nối động cơ khi mọi trạng thái hiển thị đúng với những gì bạn thấy ở ngõ ra.</p>
</div>
`
},

{
  slug: 'bien-tan-rs485-5-loi',
  category: 'bien-tan',
  title: 'Điều khiển biến tần qua RS485: 5 lỗi hay gặp khi mới đấu nối',
  summary: 'Sai cực A/B, sai thông số, sai địa chỉ thanh ghi, chưa đổi nguồn lệnh. Cách kiểm tra từng lỗi trong vài phút.',
  minutes: 9,
  body: `
<p>Điều khiển biến tần từ PLC qua RS485 (thường là giao thức Modbus RTU) giúp bạn bỏ bớt cả bó dây tín hiệu. Nhưng lần đầu làm, gần như ai cũng gặp cảnh "đấu xong mà không thấy phản hồi". Đa số rơi vào 5 lỗi dưới đây.</p>

<h2>Lỗi 1: Đảo cực A và B</h2>
<p>Triệu chứng: hoàn toàn không có phản hồi. Mỗi hãng ký hiệu một kiểu (A/B, D+/D−, 485+/485−), và ký hiệu giữa hai thiết bị khác hãng không phải lúc nào cũng cùng quy ước. Cách xử lý: đảo hai dây lại và thử lần nữa, vì không có gì bị hỏng khi đảo.</p>

<h2>Lỗi 2: Sai thông số truyền thông</h2>
<p>Hai bên phải giống nhau hoàn toàn về tốc độ truyền (baudrate), số bit dữ liệu, parity (không, chẵn, lẻ) và số bit dừng. Sai parity hoặc bit dừng là lỗi rất dễ bỏ sót vì tốc độ truyền vẫn đúng.</p>

<h2>Lỗi 3: Sai địa chỉ trạm (slave ID)</h2>
<p>Mỗi biến tần trên đường truyền có một địa chỉ trạm riêng. PLC gửi lệnh tới trạm số 1 nhưng biến tần đang cài số 2 thì sẽ không có hồi đáp.</p>

<h2>Lỗi 4: Sai địa chỉ thanh ghi</h2>
<p>Tài liệu truyền thông của biến tần liệt kê địa chỉ thanh ghi cho lệnh chạy, tần số đặt, tần số thực... Hai điểm hay nhầm:</p>
<ul>
  <li>Địa chỉ trong tài liệu ghi dạng thập lục phân (ví dụ có tiền tố <code>0x</code>) nhưng bạn nhập vào PLC theo thập phân.</li>
  <li>Cách đánh số lệch một đơn vị: có hệ thống bắt đầu đếm từ 0, có hệ thống bắt đầu từ 1.</li>
</ul>
<p>Địa chỉ thanh ghi khác nhau theo từng hãng và từng đời, nên luôn tra đúng tài liệu của biến tần bạn đang dùng.</p>

<h2>Lỗi 5: Chưa chuyển nguồn lệnh sang truyền thông</h2>
<p>Đây là lỗi gây khó hiểu nhất. Biến tần có hai tham số riêng: <strong>nguồn lệnh chạy</strong> (từ bàn phím, từ đầu vào số, hay từ truyền thông) và <strong>nguồn đặt tần số</strong> (từ bàn phím, núm xoay, analog, hay truyền thông). Nếu bạn chỉ chuyển một trong hai, sẽ gặp tình trạng:</p>
<ul>
  <li>Ghi lệnh chạy qua RS485 được, động cơ chạy, nhưng <em>ghi tần số mà tốc độ không đổi</em>.</li>
  <li>Hoặc ngược lại: tần số nhận được nhưng lệnh chạy vẫn phải bấm tay.</li>
</ul>
<p>Cách xử lý: vào tham số biến tần, chọn cả hai nguồn là truyền thông.</p>

<h2>Phần cứng cũng cần đúng</h2>
<ul>
  <li>Dùng cáp xoắn đôi có bọc chống nhiễu, đi tách khỏi dây động lực.</li>
  <li>Đường truyền dài thì gắn điện trở cuối khoảng 120 Ω ở hai đầu xa nhất.</li>
  <li>Nối chung điểm tham chiếu (GND) giữa các thiết bị nếu tài liệu yêu cầu.</li>
</ul>

<h2>Mã chức năng Modbus thường dùng</h2>
<table>
  <thead><tr><th>Mã</th><th>Ý nghĩa</th></tr></thead>
  <tbody>
    <tr><td>03 (0x03)</td><td>Đọc nhiều thanh ghi</td></tr>
    <tr><td>06 (0x06)</td><td>Ghi một thanh ghi</td></tr>
    <tr><td>16 (0x10)</td><td>Ghi nhiều thanh ghi</td></tr>
  </tbody>
</table>

<div class="callout">
  <p><strong>Mẹo tiết kiệm thời gian:</strong> trước khi lập trình PLC, dùng một bộ chuyển USB sang RS485 cùng phần mềm Modbus master trên máy tính để đọc và ghi thử thanh ghi của biến tần. Nếu máy tính nói chuyện được mà PLC thì không, lỗi nằm ở phần cài đặt trên PLC, không phải ở biến tần hay dây.</p>
</div>
`
},

{
  slug: 'esp32-gui-du-lieu-mqtt',
  category: 'esp32-iot',
  title: 'ESP32 gửi dữ liệu cảm biến lên MQTT: từ dây nối đến dashboard',
  summary: 'Đi hết một vòng: đọc cảm biến, kết nối WiFi, publish dữ liệu lên broker để hiển thị trên điện thoại.',
  minutes: 8,
  body: `
<p>MQTT là giao thức nhẹ, rất hợp để thiết bị nhỏ như ESP32 gửi số liệu về một chỗ chung. Bài này đi qua toàn bộ chuỗi từ cảm biến đến màn hình điện thoại.</p>

<h2>Bức tranh tổng thể</h2>
<ol>
  <li><strong>Cảm biến</strong> đo (nhiệt độ, độ ẩm đất, dòng điện...).</li>
  <li><strong>ESP32</strong> đọc giá trị và kết nối WiFi.</li>
  <li><strong>Broker MQTT</strong> là máy chủ trung gian nhận và phát lại dữ liệu.</li>
  <li><strong>Dashboard</strong> (ứng dụng trên điện thoại hoặc web) đăng ký nhận dữ liệu và hiển thị.</li>
</ol>
<p>Thiết bị gửi gọi là <em>publish</em>, nơi nhận gọi là <em>subscribe</em>, và dữ liệu đi theo từng <em>topic</em>. Hai bên không cần biết nhau, chỉ cần cùng một broker và cùng một topic.</p>

<h2>Đặt tên topic cho có hệ thống</h2>
<p>Dùng cấu trúc <code>ten-du-an/vi-tri/thong-so</code>, ví dụ <code>autodq/vuon-1/nhiet-do</code>. Khi có nhiều thiết bị và nhiều vị trí, bạn sẽ thấy cách đặt tên này đáng giá thế nào.</p>

<h2>Chương trình mẫu cho ESP32 (Arduino)</h2>
<p>Dùng thư viện <code>PubSubClient</code>. Chương trình kết nối WiFi, kết nối broker, rồi cứ 5 giây gửi một giá trị.</p>
<pre><code>#include &lt;WiFi.h&gt;
#include &lt;PubSubClient.h&gt;

const char* WIFI_SSID = "TEN_WIFI";
const char* WIFI_PASS = "MAT_KHAU_WIFI";
const char* MQTT_HOST = "broker.hivemq.com";   // chỉ để thử
const int   MQTT_PORT = 1883;
const char* TOPIC     = "autodq/demo/nhiet-do";

WiFiClient espClient;
PubSubClient mqtt(espClient);

void connectWifi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  while (WiFi.status() != WL_CONNECTED) delay(500);
}

void connectMqtt() {
  while (!mqtt.connected()) {
    String id = "esp32-" + String((uint32_t)ESP.getEfuseMac(), HEX);
    if (!mqtt.connect(id.c_str())) delay(2000);
  }
}

void setup() {
  Serial.begin(115200);
  connectWifi();
  mqtt.setServer(MQTT_HOST, MQTT_PORT);
}

void loop() {
  if (WiFi.status() != WL_CONNECTED) connectWifi();
  if (!mqtt.connected()) connectMqtt();
  mqtt.loop();

  static uint32_t lastSend = 0;
  if (millis() - lastSend &gt;= 5000) {
    lastSend = millis();
    float t = 27.5;               // thay bằng giá trị đọc từ cảm biến
    char buf[16];
    dtostrf(t, 1, 1, buf);
    mqtt.publish(TOPIC, buf);
    Serial.println(buf);
  }
}</code></pre>

<h2>Vì sao dùng millis() thay vì delay()</h2>
<p>Nếu dùng <code>delay(5000)</code>, trong 5 giây đó ESP32 không làm gì khác, kể cả duy trì kết nối MQTT. Dùng <code>millis()</code> để đếm thời gian giúp vòng lặp luôn chạy tiếp, kết nối ổn định hơn.</p>

<h2>Những điều cần lưu ý</h2>
<ul>
  <li><strong>Broker công cộng chỉ để học và thử.</strong> Ai cũng có thể đọc dữ liệu của bạn. Dự án thật nên tự dựng broker riêng (ví dụ Mosquitto) có tài khoản và mật khẩu.</li>
  <li><strong>Đừng đăng mật khẩu WiFi lên mạng.</strong> Trước khi chia sẻ code, hãy xóa SSID và mật khẩu thật.</li>
  <li><strong>Mất mạng thì tự kết nối lại.</strong> Chương trình trên đã kiểm tra WiFi và MQTT ở mỗi vòng lặp, thiết bị chạy ngoài hiện trường rất cần điều này.</li>
</ul>

<div class="callout">
  <p><strong>Kiểm tra nhanh:</strong> trước khi dựng dashboard, dùng một ứng dụng MQTT client trên điện thoại hoặc máy tính, đăng ký đúng topic và xem dữ liệu có về không. Nếu có, phần ESP32 đã ổn.</p>
</div>
`
},

{
  slug: 'cam-bien-pt100',
  category: 'cam-bien',
  title: 'Cảm biến PT100: đấu 2, 3, 4 dây và điều khiển có ngưỡng trễ',
  summary: 'Vì sao dây dẫn làm sai nhiệt độ, chọn loại mấy dây, và cách dừng, chạy lại theo hai ngưỡng khác nhau.',
  minutes: 7,
  body: `
<p>PT100 là cảm biến nhiệt điện trở bạch kim rất phổ biến trong công nghiệp: bền, chính xác, dùng được trong dải nhiệt rộng. "100" nghĩa là điện trở bằng 100 Ω tại 0°C, và nó tăng đều theo nhiệt độ.</p>

<h2>Điện trở theo nhiệt độ</h2>
<table>
  <thead><tr><th>Nhiệt độ</th><th>Điện trở xấp xỉ</th></tr></thead>
  <tbody>
    <tr><td>0°C</td><td>100,00 Ω</td></tr>
    <tr><td>25°C</td><td>109,73 Ω</td></tr>
    <tr><td>50°C</td><td>119,40 Ω</td></tr>
    <tr><td>100°C</td><td>138,51 Ω</td></tr>
  </tbody>
</table>
<p>Nhớ nhanh: cứ tăng 1°C thì điện trở tăng khoảng 0,385 Ω. Con số nhỏ này chính là lý do dây dẫn gây sai số.</p>

<h2>Đấu 2 dây, 3 dây hay 4 dây?</h2>
<p>Bộ đo cộng cả điện trở của dây dẫn vào điện trở cảm biến. Nếu tổng điện trở hai sợi dây là 1 Ω thì bộ đo hiểu nhầm là cảm biến nóng thêm khoảng 2,6°C (1 chia 0,385).</p>
<ul>
  <li><strong>2 dây:</strong> đơn giản nhưng sai số theo chiều dài dây. Chỉ nên dùng khi dây rất ngắn.</li>
  <li><strong>3 dây:</strong> bộ đo tự bù điện trở dây. Là lựa chọn phổ biến nhất trong công nghiệp.</li>
  <li><strong>4 dây:</strong> loại bỏ gần như hoàn toàn ảnh hưởng của dây, dùng khi cần độ chính xác cao.</li>
</ul>
<p>Số dây của cảm biến phải khớp với số dây mà bộ chuyển đổi hoặc module PLC của bạn hỗ trợ. Đọc kỹ sơ đồ đấu dây trong tài liệu của thiết bị đó.</p>

<h2>Đưa tín hiệu vào PLC</h2>
<p>Có hai cách thường gặp: dùng bộ chuyển đổi PT100 sang tín hiệu dòng 4 đến 20 mA rồi đưa vào ngõ vào analog, hoặc dùng module nhiệt độ riêng của PLC đọc trực tiếp PT100. Cách đầu dễ kiếm linh kiện, cách sau gọn hơn khi PLC có sẵn module.</p>

<h2>Điều khiển có ngưỡng trễ (hysteresis)</h2>
<p>Giả sử muốn dừng động cơ khi nhiệt độ chạm 25°C. Nếu chỉ dùng một ngưỡng 25°C để dừng và chạy lại, nhiệt độ dao động quanh 25°C sẽ làm contactor đóng ngắt liên tục, rất nhanh hỏng.</p>
<p>Giải pháp là dùng <strong>hai ngưỡng</strong>: dừng ở 25°C, chỉ chạy lại khi nhiệt độ hạ xuống 20°C. Khoảng 5°C ở giữa gọi là ngưỡng trễ.</p>
<pre><code>nhiệt độ &gt;= 25°C   →  dừng động cơ
nhiệt độ &lt;= 20°C   →  cho phép chạy lại
20°C đến 25°C       →  giữ nguyên trạng thái hiện tại</code></pre>
<p>Vùng giữa chính là bộ nhớ của mạch, cùng ý tưởng với mạch tự giữ trong bài PLC. Hai ngưỡng nên cho chỉnh được trên HMI để dễ thay đổi theo từng ứng dụng.</p>

<h2>Kiểm tra độ chính xác</h2>
<p>Nhúng đầu cảm biến vào hỗn hợp nước đá đang tan, giá trị đọc phải gần 0°C. Nếu lệch nhiều, kiểm tra lại cách đấu dây trước, rồi mới tính đến hiệu chuẩn.</p>

<div class="callout">
  <p><strong>Hay gặp:</strong> giá trị nhiệt độ nhảy lung tung thường do dây tín hiệu đi chung với dây động lực. Dùng cáp có bọc chống nhiễu, nối đất lớp bọc ở một đầu và đi dây riêng.</p>
</div>
`
},

{
  slug: 'khoi-dong-tu-ro-le-nhiet',
  category: 'dien-cong-nghiep',
  title: 'Khởi động từ và rơ le nhiệt: đấu mạch động lực và mạch điều khiển cho đúng',
  summary: 'Phân biệt hai mạch, ý nghĩa các ký hiệu đầu nối, và liên hệ với mạch tự giữ trong PLC.',
  minutes: 6,
  body: `
<div class="callout callout-warn">
  <p><strong>An toàn trước tiên:</strong> làm việc với điện 380V cần người có chuyên môn. Cắt aptomat nguồn, dùng bút thử điện xác nhận không còn điện, treo biển cảnh báo trước khi đấu hoặc sửa dây.</p>
</div>

<p>Một tủ khởi động động cơ 3 pha cơ bản gồm hai mạch tách biệt: mạch động lực (công suất lớn) và mạch điều khiển (tín hiệu nhỏ). Hiểu rõ ranh giới này giúp bạn không nhầm khi đấu và sửa lỗi.</p>

<h2>Mạch động lực</h2>
<p>Đường đi của điện cấp cho động cơ:</p>
<ol>
  <li>Aptomat (CB) bảo vệ và đóng cắt tổng.</li>
  <li>Các tiếp điểm chính của khởi động từ (contactor), đầu vào ký hiệu 1, 3, 5, đầu ra 2, 4, 6.</li>
  <li>Rơ le nhiệt, nối tiếp sau contactor, bảo vệ quá tải.</li>
  <li>Động cơ.</li>
</ol>

<h2>Mạch điều khiển</h2>
<p>Gồm nút nhấn, cuộn hút contactor và tiếp điểm phụ:</p>
<ul>
  <li><strong>Cuộn hút</strong> ký hiệu A1 và A2. Điện áp cuộn (24 VDC, 110, 220 hay 380 VAC) phải khớp với nguồn điều khiển, cấp sai điện áp sẽ cháy cuộn hoặc contactor không hút.</li>
  <li><strong>Tiếp điểm phụ thường hở</strong> của contactor (ví dụ 13 và 14) dùng làm tự giữ.</li>
  <li><strong>Tiếp điểm thường đóng của rơ le nhiệt</strong> (95 và 96) nối tiếp trong mạch điều khiển. Khi quá tải, tiếp điểm này mở ra và cắt cuộn hút.</li>
</ul>

<h2>Liên hệ với mạch tự giữ trong PLC</h2>
<p>Mạch điều khiển này chính là mạch tự giữ bằng phần cứng, giống hệt phiên bản chương trình PLC:</p>
<ul>
  <li>Nút START ↔ <code>X0</code></li>
  <li>Tiếp điểm phụ 13-14 của contactor ↔ tiếp điểm tự giữ <code>Y0</code></li>
  <li>Nút STOP thường đóng và tiếp điểm 95-96 rơ le nhiệt ↔ <code>X1</code> nối tiếp</li>
  <li>Cuộn hút A1-A2 ↔ ngõ ra <code>Y0</code></li>
</ul>
<p>Khi dùng PLC, ngõ ra Y0 thường điều khiển cuộn contactor thông qua relay trung gian hoặc trực tiếp nếu tải ngõ ra cho phép. Đọc tài liệu của PLC để biết dòng và điện áp tối đa của ngõ ra.</p>

<h2>Chỉnh rơ le nhiệt</h2>
<p>Đặt dòng bảo vệ gần bằng dòng định mức ghi trên nhãn động cơ. Đặt quá thấp thì rơ le nhảy khi vừa khởi động, đặt quá cao thì không bảo vệ được động cơ.</p>

<h2>Kiểm tra trước khi cấp điện</h2>
<ol>
  <li>Đo thông mạch và đối chiếu từng dây theo sơ đồ.</li>
  <li>Kiểm tra siết chặt các đầu cốt.</li>
  <li>Chạy thử mạch điều khiển khi chưa nối động cơ: bấm START, contactor hút và giữ; bấm STOP, contactor nhả.</li>
  <li>Chỉ nối động cơ sau khi mạch điều khiển đã hoạt động đúng.</li>
</ol>
`
}

];
