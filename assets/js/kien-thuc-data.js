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
},

{
  slug: 'siemens-s7-1200-modbus-rtu-cm1241',
  category: 'plc',
  title: 'Siemens S7-1200 truyền thông Modbus RTU: cấu hình CM1241 trong TIA Portal',
  summary: 'Sơ đồ luồng truyền thông, vai trò CM/CB 1241, thứ tự MB_COMM_LOAD và MB_MASTER, cách đọc trạng thái để tìm lỗi.',
  minutes: 8,
  body: `
<p>PLC Siemens S7-1200 có cổng PROFINET/Ethernet tích hợp; để nói chuyện Modbus RTU qua RS485, cấu hình thông dụng là lắp module truyền thông RS485 tương thích như <strong>CM 1241 RS422/485</strong> hoặc <strong>CB 1241 RS485</strong>. Kiểm tra mã phần cứng, phiên bản CPU và TIA Portal trước khi chọn module trong project.</p>

<figure class="my-8 overflow-x-auto rounded-xl border border-line bg-white p-3 sm:p-5">
  <svg class="h-auto min-w-[700px] w-full sm:min-w-0" viewBox="0 0 840 300" role="img" aria-labelledby="s7-modbus-title s7-modbus-desc">
    <title id="s7-modbus-title">Sơ đồ truyền thông Modbus RTU từ S7-1200 tới biến tần</title>
    <desc id="s7-modbus-desc">PLC Siemens S7-1200 kết nối module CM hoặc CB 1241, sau đó truyền RS485 dạng bus tới biến tần. TIA Portal cấu hình MB_COMM_LOAD và gửi yêu cầu bằng MB_MASTER.</desc>
    <rect x="1" y="1" width="838" height="298" rx="18" fill="#f5f8fc" stroke="#d7e0ee"/>
    <text x="34" y="40" fill="#0b2a5b" font-size="17" font-weight="700">Luồng truyền thông Modbus RTU</text>
    <rect x="34" y="77" width="190" height="116" rx="12" fill="#fff" stroke="#1f5fd6" stroke-width="2"/>
    <rect x="51" y="94" width="38" height="38" rx="8" fill="#eaf1fd"/>
    <path d="M61 103h18v20H61zM70 97v6m0 29v-6m-15-13h6m18 0h6" fill="none" stroke="#1f5fd6" stroke-width="2" stroke-linecap="round"/>
    <text x="102" y="112" fill="#0b2a5b" font-size="16" font-weight="700">S7-1200</text>
    <text x="51" y="153" fill="#475569" font-size="13">TIA Portal / CPU</text>
    <text x="51" y="174" fill="#475569" font-size="12">MB_COMM_LOAD → MB_MASTER</text>
    <path d="M224 135h44" fill="none" stroke="#1f5fd6" stroke-width="3"/>
    <path d="m260 128 9 7-9 7" fill="none" stroke="#1f5fd6" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    <rect x="274" y="77" width="174" height="116" rx="12" fill="#fff" stroke="#1f5fd6" stroke-width="2"/>
    <rect x="292" y="94" width="38" height="38" rx="8" fill="#eaf1fd"/>
    <path d="M302 102h18v22h-18zM306 107h10m-10 5h10m-10 5h6" fill="none" stroke="#1f5fd6" stroke-width="2" stroke-linecap="round"/>
    <text x="342" y="112" fill="#0b2a5b" font-size="15" font-weight="700">CM / CB 1241</text>
    <text x="292" y="153" fill="#475569" font-size="13">RS485 physical layer</text>
    <text x="292" y="174" fill="#475569" font-size="12">Xác nhận đúng mã module</text>
    <path d="M448 135h80" fill="none" stroke="#1f5fd6" stroke-width="3"/>
    <path d="m520 128 9 7-9 7" fill="none" stroke="#1f5fd6" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="457" y="117" fill="#475569" font-size="12">RS485 / Modbus RTU</text>
    <rect x="537" y="77" width="264" height="116" rx="12" fill="#fff" stroke="#f5a524" stroke-width="2"/>
    <rect x="555" y="94" width="38" height="38" rx="8" fill="#fff7e6"/>
    <path d="M564 103h20v21h-20zM569 108h10m-10 5h10m-10 5h7" fill="none" stroke="#b77908" stroke-width="2" stroke-linecap="round"/>
    <text x="605" y="112" fill="#0b2a5b" font-size="15" font-weight="700">Biến tần / thiết bị slave</text>
    <text x="555" y="153" fill="#475569" font-size="13">Địa chỉ trạm + thông số serial</text>
    <text x="555" y="174" fill="#475569" font-size="12">Thanh ghi theo manual đúng model</text>
    <rect x="34" y="220" width="767" height="48" rx="10" fill="#fff" stroke="#d7e0ee"/>
    <text x="53" y="250" fill="#0b2a5b" font-size="14" font-weight="600">Đường bus: A ↔ A, B ↔ B theo nhãn hai thiết bị; nhánh ngắn, không đi hình sao</text>
  </svg>
  <figcaption class="mt-3 text-sm text-slate-500">Sơ đồ khối do Automation DQ tự vẽ. Đây là minh họa kết nối, không thay thế sơ đồ chân của mã module thực tế. Trên điện thoại, vuốt ngang để xem toàn bộ hình.</figcaption>
</figure>

<h2>1. Chọn kiểu kết nối trước khi lập trình</h2>
<ul>
  <li><strong>PROFINET / Ethernet:</strong> dùng cổng Ethernet tích hợp khi thiết bị đích hỗ trợ Modbus TCP hoặc giao thức Ethernet phù hợp.</li>
  <li><strong>Modbus RTU / RS485:</strong> cần cổng serial RS485 tương thích; với cấu hình CM/CB 1241, kiểm tra module, firmware và sơ đồ chân theo tài liệu Siemens.</li>
  <li><strong>Chỉ có CPU không đồng nghĩa đã có RS485:</strong> đừng đấu cặp A/B vào cổng Ethernet hay vào chân không được nhà sản xuất chỉ định.</li>
</ul>

<h2>2. Trình tự cấu hình trong TIA Portal</h2>
<ol>
  <li>Tạo project với đúng mã CPU, firmware và phiên bản TIA Portal.</li>
  <li>Thêm CM/CB 1241 đúng mã phần cứng; kiểm tra địa chỉ module và cấu hình truyền thông trong Device configuration.</li>
  <li>Gọi <code>MB_COMM_LOAD</code> để nạp thông số cổng serial trước khi phát lệnh. Chỉ gửi yêu cầu sau khi khối báo đã khởi tạo thành công.</li>
  <li>Dùng <code>MB_MASTER</code> tạo yêu cầu đọc/ghi; điều khiển chu kỳ bằng tín hiệu yêu cầu, không phát lệnh ghi liên tục ở mọi vòng quét.</li>
  <li>Đọc các trạng thái <code>DONE</code>, <code>BUSY</code>, <code>ERROR</code> và mã lỗi của khối; chỉ cập nhật dữ liệu ứng dụng sau khi giao dịch thành công.</li>
</ol>
<p>Tên chân, kiểu dữ liệu, cấu trúc instance DB và cách cấu hình cổng có thể khác theo phiên bản CPU/TIA Portal. Hãy dùng trợ giúp tích hợp của đúng phiên bản thay vì chép nguyên một khối mẫu từ project khác.</p>

<h2>3. Đấu RS485 an toàn, ổn định</h2>
<ul>
  <li>Dùng cáp xoắn đôi phù hợp RS485; đi tách khỏi dây động lực và dây ngõ ra biến tần.</li>
  <li>Nối theo nhãn cực tính của cả hai thiết bị. Ký hiệu A/B giữa các hãng có thể khác quy ước; khi không có phản hồi, dừng hệ thống và đối chiếu tài liệu trước khi đổi dây.</li>
  <li>Nếu tài liệu thiết bị yêu cầu dây tham chiếu/COM, chỉ nối theo sơ đồ hãng. Không dùng shield làm dây tín hiệu.</li>
  <li>Điện trở kết thúc chỉ đặt ở hai đầu vật lý của bus khi thiết kế yêu cầu; không bật mọi điện trở trên các node trung gian.</li>
  <li>Không đấu/nối dây khi thiết bị đang cấp điện. Phần biến tần có điện áp nguy hiểm; công việc trong tủ điện chỉ do người đủ chuyên môn thực hiện.</li>
</ul>

<h2>4. Kiểm tra theo từng lớp</h2>
<ol>
  <li>Xác nhận module hiển thị đúng trong Device view, không có lỗi cấu hình phần cứng.</li>
  <li>So khớp baud rate, parity, số bit dừng và địa chỉ slave giữa PLC với thiết bị.</li>
  <li>Thử một lệnh đọc an toàn tới thanh ghi trạng thái đã được manual xác nhận trước khi cho phép ghi lệnh chạy.</li>
  <li>Nếu <code>BUSY</code> kéo dài hoặc timeout, kiểm tra cực tính, địa chỉ trạm, termination, thời gian phản hồi và số lần phát yêu cầu.</li>
  <li>Ghi log mã lỗi, trạng thái và thời điểm gửi/nhận để phân biệt lỗi cấu hình với lỗi vật lý.</li>
</ol>

<div class="callout callout-warn">
  <p><strong>Không dùng truyền thông làm dừng khẩn cấp.</strong> Mạch E-stop, bảo vệ quá tải và chức năng an toàn phải độc lập với Modbus và chương trình tiêu chuẩn. Chạy thử ban đầu không tải, tần số thấp, có người giám sát và phương án cô lập năng lượng phù hợp.</p>
</div>

<h2>Tài liệu tham khảo</h2>
<p><a class="font-medium text-brand hover:underline" href="https://support.industry.siemens.com/cs/ww/en/view/109741593" target="_blank" rel="noopener">Siemens S7-1200 Programmable Controller System Manual</a>. Trong TIA Portal, mở phần Instructions/Online help để xem mô tả khối Modbus tương ứng firmware đang dùng.</p>
`
},

{
  slug: 'siemens-s7-1200-kaman-km600-rs485',
  category: 'bien-tan',
  title: 'Sơ đồ đấu nối Siemens S7-1200 với biến tần Kaman KM600 qua RS485',
  summary: 'Sơ đồ bus A/B, checklist cấu hình Modbus RTU và trình tự thử đọc trạng thái trước khi gửi lệnh chạy.',
  minutes: 7,
  body: `
<p>Bài này minh họa một cấu hình thường gặp: <strong>S7-1200 làm Modbus RTU master</strong>, module RS485 CM/CB 1241 làm cổng vật lý và biến tần Kaman KM600 làm slave. Trước khi làm theo, xác nhận KM600 đúng phiên bản có RS485 tích hợp và Siemens module đúng mã phần cứng; không phải mọi CPU đều có sẵn cổng RS485.</p>

<figure class="my-8 overflow-x-auto rounded-xl border border-line bg-white p-3 sm:p-5">
  <svg class="h-auto min-w-[700px] w-full sm:min-w-0" viewBox="0 0 840 380" role="img" aria-labelledby="kaman-wiring-title kaman-wiring-desc">
    <title id="kaman-wiring-title">Sơ đồ nguyên lý đấu nối RS485 Siemens S7-1200 và Kaman KM600</title>
    <desc id="kaman-wiring-desc">CM hoặc CB 1241 nối bus RS485 hai dây tới cổng truyền thông của biến tần KM600. Sơ đồ tách riêng nguồn PLC và nguồn động lực, không vẽ dây động lực để tránh nhầm.</desc>
    <rect x="1" y="1" width="838" height="378" rx="18" fill="#f5f8fc" stroke="#d7e0ee"/>
    <text x="30" y="40" fill="#0b2a5b" font-size="17" font-weight="700">Sơ đồ nguyên lý — chỉ thể hiện đường truyền thông</text>
    <rect x="28" y="75" width="220" height="182" rx="14" fill="#fff" stroke="#1f5fd6" stroke-width="2"/>
    <rect x="49" y="97" width="72" height="48" rx="7" fill="#0b2a5b"/>
    <path d="M62 108v26m46-26v26M62 121h17m12 0h17" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M79 113v16m12-16v16" fill="none" stroke="#f5a524" stroke-width="2.5" stroke-linecap="round"/>
    <text x="132" y="117" fill="#0b2a5b" font-size="16" font-weight="700">S7-1200</text>
    <text x="49" y="171" fill="#334155" font-size="14" font-weight="600">CPU + CM/CB 1241</text>
    <text x="49" y="194" fill="#64748b" font-size="12">Cổng serial RS485</text>
    <rect x="49" y="210" width="73" height="25" rx="5" fill="#eaf1fd"/>
    <text x="63" y="227" fill="#1f5fd6" font-size="12" font-weight="700">A / D+</text>
    <rect x="132" y="210" width="73" height="25" rx="5" fill="#eaf1fd"/>
    <text x="146" y="227" fill="#1f5fd6" font-size="12" font-weight="700">B / D−</text>
    <path d="M122 222H335" fill="none" stroke="#1f5fd6" stroke-width="4"/>
    <path d="M122 243H335" fill="none" stroke="#f5a524" stroke-width="4"/>
    <text x="200" y="211" fill="#1f5fd6" font-size="12" font-weight="700">A(+) theo nhãn/manual</text>
    <text x="200" y="262" fill="#9a6700" font-size="12" font-weight="700">B(−) theo nhãn/manual</text>
    <rect x="347" y="209" width="24" height="48" rx="4" fill="#fff" stroke="#64748b" stroke-width="2"/>
    <path d="M353 218h12m-12 9h12m-12 9h12" stroke="#64748b" stroke-width="2"/>
    <text x="325" y="285" fill="#64748b" font-size="11">Cáp xoắn đôi</text>
    <path d="M371 222H584" fill="none" stroke="#1f5fd6" stroke-width="4"/>
    <path d="M371 243H584" fill="none" stroke="#f5a524" stroke-width="4"/>
    <rect x="594" y="75" width="218" height="182" rx="14" fill="#fff" stroke="#f5a524" stroke-width="2"/>
    <rect x="615" y="97" width="65" height="50" rx="7" fill="#fff7e6"/>
    <path d="M632 107h31v29h-31zM638 113h18m-18 7h18m-18 7h12" fill="none" stroke="#b77908" stroke-width="2" stroke-linecap="round"/>
    <text x="692" y="117" fill="#0b2a5b" font-size="15" font-weight="700">Kaman KM600</text>
    <text x="615" y="171" fill="#334155" font-size="14" font-weight="600">Cổng RS485*</text>
    <text x="615" y="194" fill="#64748b" font-size="12">Slave ID + thông số serial</text>
    <rect x="615" y="210" width="73" height="25" rx="5" fill="#fff7e6"/>
    <text x="629" y="227" fill="#9a6700" font-size="12" font-weight="700">A / D+</text>
    <rect x="698" y="210" width="73" height="25" rx="5" fill="#fff7e6"/>
    <text x="712" y="227" fill="#9a6700" font-size="12" font-weight="700">B / D−</text>
    <path d="M40 315h760" stroke="#d7e0ee" stroke-width="1"/>
    <rect x="42" y="329" width="18" height="18" rx="4" fill="#eaf1fd"/>
    <path d="M46 338h10" stroke="#1f5fd6" stroke-width="3"/>
    <text x="68" y="343" fill="#475569" font-size="12">Bus truyền thông RS485 — không phải dây nguồn hay dây motor</text>
    <rect x="457" y="329" width="18" height="18" rx="4" fill="#fff7e6"/>
    <path d="M461 338h10" stroke="#f5a524" stroke-width="3"/>
    <text x="483" y="343" fill="#475569" font-size="12">Đường B trong sơ đồ, đối chiếu ký hiệu thực tế</text>
    <text x="30" y="367" fill="#64748b" font-size="11">* Tên/vị trí chân và điện trở kết thúc phụ thuộc đúng mã thiết bị; xem manual/nhãn cọc trước khi đấu.</text>
  </svg>
  <figcaption class="mt-3 text-sm text-slate-500">Sơ đồ nguyên lý do Automation DQ tự vẽ, không theo tỉ lệ và không thay thế sơ đồ chân của hãng. Không hiển thị phần đấu nguồn AC/DC hoặc U/V/W của động cơ. Trên điện thoại, vuốt ngang để xem toàn bộ hình.</figcaption>
</figure>

<h2>1. Phần cứng cần có</h2>
<ul>
  <li>PLC Siemens S7-1200 với CM/CB 1241 RS485 được hỗ trợ bởi CPU/firmware dự án.</li>
  <li>Biến tần đúng model Kaman KM600, có cổng truyền thông RS485 theo tài liệu của phiên bản đó.</li>
  <li>Cáp xoắn đôi RS485; có thể cần điện trở cuối và dây tham chiếu theo chiều dài, topology, và hướng dẫn của hai hãng.</li>
</ul>
<p>Trên sơ đồ, A/B chỉ là cách gọi phổ biến để minh họa. Một số tài liệu gọi D+/D− hoặc có cách đặt A/B ngược nhau. Hãy ghép theo quy ước trong manual của cả module Siemens và biến tần, không dựa riêng vào màu dây.</p>

<h2>2. Cấu hình hai đầu truyền thông</h2>
<p>Trên S7-1200, cấu hình module đúng trong TIA Portal, nạp thông số cổng phù hợp rồi dùng <code>MB_COMM_LOAD</code> và <code>MB_MASTER</code>. Trên KM600, đặt địa chỉ slave khác 0, tốc độ truyền, parity và stop bit giống hệt PLC.</p>
<p>Một số tài liệu KM600 ghi nhóm tham số truyền thông <code>F18</code>, nguồn lệnh <code>F02.00</code>, nguồn tần số <code>F01.00</code>; tên/giá trị có thể thay đổi theo phiên bản. Xem bài <a class="font-medium text-brand hover:underline" href="#bien-tan-kaman-km600-modbus-rs485">bảng tham số và thanh ghi KM600</a> để tham khảo, sau đó xác nhận bằng manual đi kèm đúng biến tần.</p>

<h2>3. Trình tự chạy thử giảm rủi ro</h2>
<ol>
  <li>Ngắt nguồn, kiểm tra model/module và đấu dây theo tài liệu thiết bị; kiểm tra cách điện trước khi cấp nguồn.</li>
  <li>Ban đầu chỉ đọc thanh ghi trạng thái/giá trị giám sát đã xác nhận trong manual. Kiểm tra dữ liệu hợp lý và mã lỗi truyền thông.</li>
  <li>Chỉ sau khi đọc ổn định mới thử lệnh ghi, với tần số thấp, động cơ tách tải hoặc điều kiện thử nghiệm đã được đánh giá an toàn.</li>
  <li>Kiểm tra phản hồi thực tế từ biến tần; không coi việc PLC gửi lệnh thành công là xác nhận motor đã dừng/chạy an toàn.</li>
  <li>Thử tình huống mất cáp/PLC mất nguồn và xác nhận phản ứng fail-safe của hệ thống.</li>
</ol>

<h2>4. Nếu PLC không nhận phản hồi</h2>
<ul>
  <li>So baud rate, parity, stop bit, slave ID và timeout hai đầu.</li>
  <li>Kiểm tra module có được cấu hình đúng, <code>MB_COMM_LOAD</code> hoàn tất chưa, <code>MB_MASTER</code> có trả <code>ERROR</code> hay timeout không.</li>
  <li>Đối chiếu địa chỉ thanh ghi và cách đánh số 0/1-based giữa manual Kaman với lệnh TIA Portal.</li>
  <li>Kiểm tra topology bus, nhánh dây, shield/ground và termination theo tài liệu; không bật điện trở cuối trên mọi node.</li>
  <li>Nếu cần đổi A/B để kiểm tra, dừng và cô lập nguồn theo quy trình trước khi thao tác.</li>
</ul>

<div class="callout callout-warn">
  <p><strong>An toàn máy:</strong> dừng khẩn cấp, contactor an toàn và bảo vệ quá tải không được phụ thuộc duy nhất vào lệnh Modbus. Không thao tác cọc nguồn/động cơ của biến tần khi còn điện; chờ xả tụ theo hướng dẫn của hãng và xác nhận hết điện bằng thiết bị phù hợp.</p>
</div>

<p class="text-sm text-slate-500">Tài liệu tham khảo: <a class="font-medium text-brand hover:underline" href="https://support.industry.siemens.com/cs/ww/en/view/109741593" target="_blank" rel="noopener">manual hệ thống S7-1200 của Siemens</a> và manual KM600 đúng mã/phiên bản do nhà cung cấp thiết bị phát hành.</p>
`
},

{
  slug: 'bien-tan-kaman-km600-modbus-rs485',
  category: 'bien-tan',
  title: 'Biến tần Kaman KM600 qua RS485 Modbus RTU: cài tham số, thanh ghi và khung truyền có sẵn CRC',
  summary: 'Cài F18, F02.00, F01.00 trên biến tần, bảng thanh ghi 2000H, 2001H, 2100H và các khung Modbus RTU để PLC Wecon (hoặc máy tính) chạy, dừng, đặt tần số, đọc trạng thái.',
  minutes: 10,
  body: `
<p>Bài này gom lại toàn bộ phần cần thiết để điều khiển biến tần <strong>Kaman KM600</strong> từ PLC (ví dụ PLC Wecon làm master) qua cổng RS485 tích hợp, theo giao thức Modbus RTU. Số liệu lấy từ tài liệu hướng dẫn KM600 (nhóm tham số F18 và chương 9 Communication Protocol). Mọi giá trị nên được kiểm chứng lại trên biến tần thật trước khi nối tải.</p>

<h2>1. Đấu nối phần cứng</h2>
<ul>
  <li>Cổng RS485 của biến tần gồm 3 đầu: <code>A</code> (tín hiệu vi sai +), <code>B</code> (tín hiệu vi sai −) và <code>GND</code>. Cổng được cách ly bên trong với COM.</li>
  <li>Dùng cáp xoắn đôi có bọc chống nhiễu, chiều dài tối đa theo catalog là 300 m.</li>
  <li>Biến tần có công tắc gạt chọn điện trở cuối 120 Ω (mặc định OFF). Chỉ bật ON ở biến tần nằm cuối đường truyền.</li>
  <li>Nối A của PLC với A của biến tần, B với B. Nếu không có phản hồi thì đảo lại A/B, vì mỗi hãng ký hiệu một kiểu.</li>
</ul>

<h2>2. Cài đặt tham số trên biến tần</h2>
<table>
  <thead><tr><th>Tham số</th><th>Ý nghĩa</th><th>Giá trị dùng</th></tr></thead>
  <tbody>
    <tr><td><code>F18.00</code></td><td>Địa chỉ trạm (0 là broadcast)</td><td>1 đến 247, ví dụ 1</td></tr>
    <tr><td><code>F18.01</code></td><td>Tốc độ truyền: hàng đơn vị là Modbus (5 = 9600, 6 = 19200, 7 = 38400, 8 = 57600, 9 = 115200); hàng chục là CAN</td><td>Ví dụ <code>45</code> là Modbus 9600 và CAN 250K (giá trị mặc định)</td></tr>
    <tr><td><code>F18.02</code></td><td>Khung dữ liệu: 0 = 8-N-2, 1 = 8-E-1, 2 = 8-O-1, 3 = 8-N-1</td><td>Chọn giống cấu hình cổng của PLC</td></tr>
    <tr><td><code>F18.03</code></td><td>Thời gian trễ trả lời</td><td>Mặc định 2 ms</td></tr>
    <tr><td><code>F18.04</code></td><td>Thời gian báo lỗi mất truyền thông (0.0 là tắt, 0.1 đến 60.0 s)</td><td>Nên đặt, ví dụ 2.0 s</td></tr>
    <tr><td><code>F18.05</code></td><td>Cách xử lý khi mất truyền thông: 0 = báo lỗi và dừng tự do, 1 = báo lỗi và dừng theo kiểu dừng đã cài, 2 = không báo lỗi, tiếp tục chạy</td><td>Nên chọn 0 hoặc 1</td></tr>
    <tr><td><code>F02.00</code></td><td>Nguồn lệnh chạy: 3 hoặc 4 là lệnh từ truyền thông (3 là phím STOP bị vô hiệu, 4 là phím STOP vẫn dùng được)</td><td><code>3</code> hoặc <code>4</code></td></tr>
    <tr><td><code>F01.00</code></td><td>Nguồn đặt tần số X</td><td><code>9</code> (Communication setting)</td></tr>
  </tbody>
</table>

<div class="callout callout-warn">
  <p><strong>Tài liệu có hai chỗ mâu thuẫn về giá trị mặc định.</strong> Mục 9.2 ghi mặc định là E-8-1, 19200 bps, nhưng bảng tham số F18 cho mặc định 9600 bps (<code>F18.01 = 45</code>) và 8-N-2 (<code>F18.02 = 0</code>). Đừng tin vào mặc định: vào phím biến tần đọc lại F18.01 và F18.02 rồi cài PLC cho khớp.</p>
</div>

<div class="callout">
  <p><strong>Nhớ chuyển cả hai nguồn.</strong> Chỉ đặt <code>F02.00</code> mà để <code>F01.00</code> là nguồn khác thì lệnh chạy qua RS485 được nhưng ghi tần số không làm tốc độ đổi. Ngược lại, chỉ đổi <code>F01.00</code> thì tần số nhận nhưng vẫn phải bấm tay để chạy.</p>
</div>

<h2>3. Bảng thanh ghi dùng khi điều khiển</h2>
<p>Dùng mã chức năng <code>0x03</code> (đọc), <code>0x06</code> (ghi một thanh ghi). Biến tần chỉ hỗ trợ chế độ RTU.</p>
<table>
  <thead><tr><th>Địa chỉ</th><th>Chức năng</th><th>Giá trị</th><th>R/W</th></tr></thead>
  <tbody>
    <tr><td><code>2000H</code></td><td>Lệnh điều khiển</td><td>1 chạy thuận, 2 chạy nghịch, 3 jog thuận, 4 jog nghịch, 5 dừng giảm tốc, 6 dừng tự do (khẩn cấp), 7 reset lỗi</td><td>W</td></tr>
    <tr><td><code>2001H</code></td><td>Tần số đặt</td><td>-10000 đến 10000, tương ứng -200.0% đến 200.0%</td><td>W</td></tr>
    <tr><td><code>2002H</code></td><td>Giới hạn trên tần số chạy thuận</td><td>0 đến 10000, tương ứng 0.0 Hz đến F01.07</td><td>W</td></tr>
    <tr><td><code>2003H</code></td><td>Giới hạn trên tần số chạy nghịch</td><td>0 đến 10000, tương ứng 0.0 Hz đến F01.07</td><td>W</td></tr>
    <tr><td><code>2100H</code></td><td>Tần số ra</td><td>Đọc</td><td>R</td></tr>
    <tr><td><code>2101H</code></td><td>Tần số đặt (trạng thái)</td><td>Đọc</td><td>W/R</td></tr>
    <tr><td><code>2102H</code></td><td>Dòng ra</td><td>Đọc</td><td>R</td></tr>
    <tr><td><code>210AH</code></td><td>Trạng thái biến tần</td><td>1 chạy thuận, 2 chạy nghịch, 3 jog thuận, 4 jog nghịch, 5 lỗi, 6 thấp áp, 7 dừng</td><td>R</td></tr>
    <tr><td><code>210BH</code></td><td>Mã lỗi</td><td>0 là không lỗi, ví dụ 22 là lỗi truyền thông (xem bảng lỗi trong catalog)</td><td>R</td></tr>
  </tbody>
</table>

<div class="callout callout-warn">
  <p><strong>Đơn vị của thanh ghi 2001H cần kiểm chứng.</strong> Catalog ghi -10000 đến 10000 ứng với -200.0% đến 200.0%, trong khi các thanh ghi 2002H và 2003H lại ghi 10000 ứng với 100% của F01.07. Hai cách hiểu cho hai kết quả khác nhau (10000 có thể là 100% hoặc 200% tần số tối đa). Cách an toàn: bật biến tần không tải, ghi thử một giá trị nhỏ vào 2001H rồi đọc lại 2100H để xác định hệ số thật. Ngoài ra bảng ghi nhãn "F99.99" cho 2100H, nhiều khả năng là in nhầm của F99.00.</p>
</div>

<h2>4. Khung Modbus RTU mẫu (địa chỉ trạm 1)</h2>
<p>Các khung dưới đây ghi dạng hex, hai byte cuối là CRC16 (byte thấp trước, byte cao sau). Đã tính CRC sẵn cho trạm số 1, nếu đổi địa chỉ trạm thì phải tính lại.</p>
<table>
  <thead><tr><th>Việc cần làm</th><th>Khung gửi</th></tr></thead>
  <tbody>
    <tr><td>Chạy thuận</td><td><code>01 06 20 00 00 01 43 CA</code></td></tr>
    <tr><td>Chạy nghịch</td><td><code>01 06 20 00 00 02 03 CB</code></td></tr>
    <tr><td>Dừng giảm tốc</td><td><code>01 06 20 00 00 05 42 09</code></td></tr>
    <tr><td>Reset lỗi</td><td><code>01 06 20 00 00 07 C3 C8</code></td></tr>
    <tr><td>Ghi 2001H = 2500 (0x09C4)</td><td><code>01 06 20 01 09 C4 D4 09</code></td></tr>
    <tr><td>Đọc 3 thanh ghi từ 2100H (tần số ra, tần số đặt, dòng)</td><td><code>01 03 21 00 00 03 0F F7</code></td></tr>
    <tr><td>Đọc trạng thái và mã lỗi (210AH, 210BH)</td><td><code>01 03 21 0A 00 02 EE 35</code></td></tr>
    <tr><td>Ghi F01.00 = 9 (nguồn tần số là truyền thông)</td><td><code>01 06 01 00 00 09 48 30</code></td></tr>
    <tr><td>Ghi F02.00 = 3 (lệnh chạy từ truyền thông)</td><td><code>01 06 02 00 00 03 C8 73</code></td></tr>
  </tbody>
</table>
<p>Với lệnh ghi <code>0x06</code>, biến tần trả về đúng khung đã nhận. Với lệnh đọc <code>0x03</code>, biến tần trả về địa chỉ trạm, mã 03, số byte dữ liệu rồi các thanh ghi (byte cao trước).</p>

<h2>5. Địa chỉ tham số F và cách tránh mòn EEPROM</h2>
<ul>
  <li>Địa chỉ tham số gồm byte cao là số nhóm (F01 là <code>0x01</code>, F18 là <code>0x12</code>, F19 là <code>0x13</code>...) và byte thấp là số thứ tự trong nhóm, viết hex. Ví dụ F01.12 có địa chỉ <code>0x010C</code>.</li>
  <li>Ghi vào địa chỉ này sẽ lưu vào EEPROM. Nếu ghi liên tục sẽ làm giảm tuổi thọ bộ nhớ. Cộng thêm <code>0x40</code> vào byte cao để chỉ ghi vào RAM, ví dụ <code>0x410C</code> thay cho <code>0x010C</code>.</li>
  <li>Đọc tối đa 16 địa chỉ liên tiếp trong một lần, nhiều hơn biến tần trả lỗi. Ghi chỉ được từng thanh ghi một.</li>
  <li>Tham số chỉ đọc, hoặc tham số không cho sửa khi đang chạy, sẽ bị từ chối. Mật khẩu người dùng và chức năng autotune không ghi được qua truyền thông.</li>
</ul>

<h2>6. Phía PLC Wecon (master)</h2>
<p>Tên lệnh Modbus và cách khai báo cổng phụ thuộc vào dòng PLC và phiên bản phần mềm lập trình Wecon. Hãy tra đúng tài liệu của PLC bạn đang dùng. Những điều cần khớp thì không phụ thuộc phần mềm:</p>
<ul>
  <li><strong>Cổng truyền thông:</strong> đặt chế độ Modbus RTU master, cùng tốc độ truyền và cùng khung dữ liệu (parity, stop bit) với <code>F18.01</code> và <code>F18.02</code> của biến tần.</li>
  <li><strong>Địa chỉ trạm:</strong> bằng <code>F18.00</code>.</li>
  <li><strong>Hệ đếm của địa chỉ thanh ghi:</strong> catalog ghi dạng hex. Nếu lệnh của PLC nhận số thập phân thì đổi: <code>2000H = 8192</code>, <code>2001H = 8193</code>, <code>2100H = 8448</code>, <code>210AH = 8458</code>, <code>210BH = 8459</code>. Một số hệ thống còn cộng thêm 40001 hoặc lệch 1 đơn vị, hãy thử đọc <code>2100H</code> khi biến tần đang chạy để xác nhận.</li>
</ul>
<p>Trình tự vòng quét nên dùng:</p>
<ol>
  <li>Cài <code>F02.00</code> và <code>F01.00</code> bằng phím một lần khi lắp đặt, không cần ghi qua RS485 mỗi lần chạy.</li>
  <li>Khi có lệnh chạy: ghi tần số vào <code>2001H</code> trước, rồi ghi <code>0001</code> vào <code>2000H</code>.</li>
  <li>Khi đổi tần số: chỉ ghi lại <code>2001H</code> lúc giá trị thay đổi, không ghi lặp mỗi vòng quét.</li>
  <li>Đọc <code>2100H</code> (tần số ra), <code>210AH</code> (trạng thái), <code>210BH</code> (mã lỗi) theo chu kỳ khoảng 200 đến 500 ms.</li>
  <li>Khi dừng: ghi <code>0005</code> vào <code>2000H</code> (dừng giảm tốc). Dừng khẩn cấp dùng <code>0006</code> nhưng không thay thế được mạch dừng khẩn cấp phần cứng.</li>
  <li>Khi có lỗi (<code>210AH = 5</code>): xử lý nguyên nhân rồi mới ghi <code>0007</code> để reset.</li>
</ol>
<p>Mỗi lệnh chờ hồi đáp (hoặc hết thời gian chờ) xong mới gửi lệnh tiếp theo. Giữa hai khung phải có khoảng nghỉ tối thiểu 3.5 ký tự, tức khoảng 4 ms ở 9600 bps.</p>

<h2>7. Kiểm tra nhanh bằng máy tính (USB sang RS485)</h2>
<p>Nên chạy thử bằng script này trước khi lập trình PLC. Nếu máy tính điều khiển được mà PLC thì không, lỗi nằm ở cài đặt trên PLC. Ví dụ dưới dùng 9600 bps, 8-N-2 (mặc định theo bảng F18), cần cài <code>pyserial</code>:</p>
<pre><code>import serial, time

def crc16(data: bytes) -&gt; bytes:
    crc = 0xFFFF
    for b in data:
        crc ^= b
        for _ in range(8):
            crc = (crc &gt;&gt; 1) ^ 0xA001 if crc &amp; 1 else crc &gt;&gt; 1
    return bytes([crc &amp; 0xFF, crc &gt;&gt; 8])   # byte thấp gửi trước

def request(ser, frame: bytes) -&gt; bytes:
    ser.reset_input_buffer()
    ser.write(frame + crc16(frame))
    time.sleep(0.1)
    return ser.read(64)

SLAVE = 1
ser = serial.Serial("COM5", 9600, bytesize=8, parity="N", stopbits=2, timeout=0.5)

def write_reg(addr, val):
    return request(ser, bytes([SLAVE, 0x06, addr &gt;&gt; 8, addr &amp; 0xFF, val &gt;&gt; 8, val &amp; 0xFF]))

def read_regs(addr, n):
    return request(ser, bytes([SLAVE, 0x03, addr &gt;&gt; 8, addr &amp; 0xFF, 0, n]))

print(write_reg(0x2001, 500).hex(" "))    # tần số đặt nhỏ để thử, kiểm tra hệ số ở mục 3
print(write_reg(0x2000, 1).hex(" "))      # chạy thuận
time.sleep(3)
print(read_regs(0x2100, 3).hex(" "))      # tần số ra, tần số đặt, dòng
print(read_regs(0x210A, 2).hex(" "))      # trạng thái, mã lỗi
print(write_reg(0x2000, 5).hex(" "))      # dừng giảm tốc
ser.close()</code></pre>
<p>Hàm <code>crc16</code> ở trên cho đúng các giá trị CRC trong bảng mục 4 (ví dụ khung chạy thuận kết thúc bằng <code>43 CA</code>).</p>

<h2>8. Khi biến tần trả lỗi</h2>
<p>Khi có lỗi, biến tần trả khung gồm địa chỉ trạm, mã lệnh đặt bit 7 lên 1 (<code>0x83</code> khi đọc, <code>0x86</code> khi ghi), mã lỗi và CRC.</p>
<table>
  <thead><tr><th>Mã lỗi</th><th>Tên</th><th>Nguyên nhân thường gặp</th></tr></thead>
  <tbody>
    <tr><td><code>0x01</code></td><td>Illegal CMD</td><td>Mã chức năng không tồn tại hoặc không hỗ trợ</td></tr>
    <tr><td><code>0x02</code></td><td>Illegal Data Address</td><td>Địa chỉ sai, vượt phạm vi, hoặc đọc thanh ghi chỉ ghi (ghi thanh ghi chỉ đọc)</td></tr>
    <tr><td><code>0x03</code></td><td>Illegal Data</td><td>Giá trị ngoài phạm vi, tham số chỉ đọc, tham số không cho sửa lúc đang chạy, hoặc biến tần đang bận lưu bộ nhớ</td></tr>
  </tbody>
</table>

<h2>9. Danh sách kiểm tra khi không có phản hồi</h2>
<ol>
  <li>Đảo cặp A/B.</li>
  <li>Đọc lại <code>F18.00</code>, <code>F18.01</code>, <code>F18.02</code> trên phím và so với cài đặt của PLC.</li>
  <li>Đúng nguồn lệnh: <code>F02.00 = 3</code> hoặc <code>4</code>, <code>F01.00 = 9</code>.</li>
  <li>Kiểm tra hệ đếm và độ lệch của địa chỉ thanh ghi trong lệnh PLC.</li>
  <li>Điện trở cuối 120 Ω chỉ bật ở thiết bị cuối đường truyền, dây RS485 đi tách khỏi dây động lực.</li>
  <li>Biến tần báo lỗi truyền thông (mã 22) thì kiểm tra <code>F18.04</code>: PLC phải gửi lệnh đều đặn trong thời gian đó, vì nếu không biến tần sẽ báo lỗi và dừng theo <code>F18.05</code>.</li>
</ol>

<div class="callout callout-warn">
  <p><strong>An toàn:</strong> cài <code>F18.04</code> khác 0 và chọn <code>F18.05</code> là dừng, để khi đứt dây hay PLC treo thì biến tần tự dừng thay vì chạy mãi theo lệnh cuối cùng. Lần đầu thử nên tháo tải hoặc cho động cơ chạy không tải ở tần số thấp.</p>
</div>
`
}

];
