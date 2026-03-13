const TAROT_CARDS = [
  {
    id: 0,
    name: "The Fool",
    nameVn: "Kẻ Ngốc",
    number: 0,
    symbol: "🐱",
    color: "#F4D03F",
    gradient: ["#F7DC6F", "#F39C12"],
    meaning: "Khởi đầu mới, ngây thơ, dám thử nghiệm, tin tưởng vũ trụ",
    meaningPast: "Một khởi đầu hoặc quá khứ ngây thơ. Có thể bạn đã bắt đầu điều gì đó mới mẻ hoặc có cơ hội mới.",
    meaningPresent: "Bạn đang ở bước đầu của hành trình. Hãy tin tưởng bản thân và tiến về phía trước.",
    meaningFuture: "Một khởi đầu mới đang chờ đợi. Hãy sẵn sàng đón nhận cơ hội mới với lòng tin.",
    upright: "Khởi đầu, ngây thơ, tự do, tiềm năng",
    reversed: "Liều lĩnh, sợ hãi, thiếu kế hoạch"
  },
  {
    id: 1,
    name: "The Magician",
    nameVn: "Nhà Ảo Thuật",
    number: 1,
    symbol: "⚡",
    color: "#E74C3C",
    gradient: ["#E74C3C", "#C0392B"],
    meaning: "Hành động, tài năng, sáng tạo, nguồn lực",
    meaningPast: "Bạn đã sử dụng tài năng và nguồn lực của mình để đạt được thành công.",
    meaningPresent: "Bạn có tất cả công cụ cần thiết ngay bây giờ. Hãy hành động!",
    meaningFuture: "Năng lực của bạn sẽ được phát huy. Chuẩn bị để tỏa sáng.",
    upright: "Sức mạnh, hành động, kỹ năng",
    reversed: "Bất lực, lãng phí tiềm năng"
  },
  {
    id: 2,
    name: "The High Priestess",
    nameVn: "Nữ Giáo Chủ",
    number: 2,
    symbol: "🌙",
    color: "#9B59B6",
    gradient: ["#9B59B6", "#8E44AD"],
    meaning: "Trực giác, bí ẩn, tiềm thức, nội tâm",
    meaningPast: "Có những điều bạn đã hiểu từ trong sâu thẳm. Hãy tin vào trực giác của mình.",
    meaningPresent: "Hãy lắng nghe giọng nói bên trong. Đừng vội đưa ra quyết định.",
    meaningFuture: "Sự thật sẽ được tiết lộ. Hãy kiên nhẫn và tin tưởng vào quá trình.",
    upright: "Trực giác, bí ẩn, trí tuệ",
    reversed: "Bỏ qua trực giác, che giấu sự thật"
  },
  {
    id: 3,
    name: "The Empress",
    nameVn: "Nữ Hoàng",
    number: 3,
    symbol: "🌸",
    color: "#27AE60",
    gradient: ["#27AE60", "#1E8449"],
    meaning: "Phồn thực, nuôi dưỡng, sáng tạo, thiên nhiên",
    meaningPast: "Bạn đã được nuôi dưỡng hoặc đã nuôi dưỡng người khác. Tình yêu và sự chăm sóc đã hiện diện.",
    meaningPresent: "Đây là thời điểm của sự sáng tạo và nuôi dưỡng. Hãy chăm sóc bản thân và người thân.",
    meaningFuture: "Sự phồn thực và thịnh vượng đang đến. Hãy mở lòng đón nhận.",
    upright: "Sức sống, nữ tính, sáng tạo",
    reversed: "Tê liệt sáng tạo, phụ thuộc"
  },
  {
    id: 4,
    name: "The Emperor",
    nameVn: "Nam Hoàng",
    number: 4,
    symbol: "👑",
    color: "#E67E22",
    gradient: ["#E67E22", "#D35400"],
    meaning: "Quyền lực, trật tự, kỷ luật, cha mẹ",
    meaningPast: "Bạn đã xây dựng cấu trúc và kỷ luật trong cuộc sống.",
    meaningPresent: "Hãy thiết lập ranh giới rõ ràng. Cần có trật tự và kỷ luật.",
    meaningFuture: "Bạn sẽ đạt được sự ổn định và quyền lực. Hãy dẫn dắt bằng tấm gương.",
    upright: "Quyền lực, kỷ luật, cấu trúc",
    reversed: "Độc đoán, thiếu kỷ luật"
  },
  {
    id: 5,
    name: "The Hierophant",
    nameVn: "Giáo Chủ",
    number: 5,
    symbol: "📜",
    color: "#8E44AD",
    gradient: ["#9B59B6", "#7D3C98"],
    meaning: "Truyền thống, giáo dục, đức tin, hướng dẫn",
    meaningPast: "Bạn đã nhận được sự hướng dẫn từ truyền thống hoặc người có kinh nghiệm.",
    meaningPresent: "Hãy tìm kiếm sự hướng dẫn. Có thể cần một người thầy hoặc mentor.",
    meaningFuture: "Tri thức và sự hiểu biết sẽ đến. Hãy mở lòng học hỏi.",
    upright: "Truyền thống, đức tin, giáo dục",
    reversed: "Phản kháng quyền uy, thử thách niềm tin"
  },
  {
    id: 6,
    name: "The Lovers",
    nameVn: "Đôi Lứa",
    number: 6,
    symbol: "💕",
    color: "#E91E63",
    gradient: ["#E91E63", "#C2185B"],
    meaning: "Tình yêu, hài hòa, lựa chọn, đối tác",
    meaningPast: "Một mối quan hệ quan trọng hoặc quyết định lớn đã ảnh hưởng đến bạn.",
    meaningPresent: "Bạn đứng trước một lựa chọn quan trọng. Hãy chọn theo trái tim.",
    meaningFuture: "Tình yêu và hài hòa đang chờ đợi. Hãy tin vào tình yêu.",
    upright: "Tình yêu, hài hòa, sự lựa chọn",
    reversed: "Mất cân bằng, xung đột giá trị"
  },
  {
    id: 7,
    name: "The Chariot",
    nameVn: "Cỗ Xe",
    number: 7,
    symbol: "⚔️",
    color: "#3498DB",
    gradient: ["#3498DB", "#2980B9"],
    meaning: "Chiến thắng, ý chí, quyết tâm, hành trình",
    meaningPast: "Bạn đã vượt qua thử thách và giành chiến thắng.",
    meaningPresent: "Hãy kiên định với mục tiêu. Chiến thắng đang trong tầm tay.",
    meaningFuture: "Bạn sẽ chiến thắng! Hãy giữ vững ý chí và tiếp tục tiến lên.",
    upright: "Chiến thắng, ý chí, tự tin",
    reversed: "Thiếu định hướng, bạo lực"
  },
  {
    id: 8,
    name: "Strength",
    nameVn: "Sức Mạnh",
    number: 8,
    symbol: "🦁",
    color: "#F39C12",
    gradient: ["#F39C12", "#E67E22"],
    meaning: "Dũng cảm, kiên nhẫn, nội lực, từ bi",
    meaningPast: "Bạn đã thể hiện sự dũng cảm và kiên nhẫn trong hoàn cảnh khó khăn.",
    meaningPresent: "Hãy dùng sức mạnh bên trong. Kiên nhẫn và từ bi sẽ giúp bạn vượt qua.",
    meaningFuture: "Bạn sẽ tìm thấy sức mạnh từ bên trong. Hãy tin vào chính mình.",
    upright: "Dũng cảm, kiên nhẫn, tự chủ",
    reversed: "Nóng nảy, thiếu kiên nhẫn"
  },
  {
    id: 9,
    name: "The Hermit",
    nameVn: "Ẩn Sĩ",
    number: 9,
    symbol: "🔦",
    color: "#95A5A6",
    gradient: ["#95A5A6", "#7F8C8D"],
    meaning: "Tự reflection, cô đơn, trí tuệ, nội tâm",
    meaningPast: "Bạn đã dành thời gian để hiểu bản thân sâu hơn.",
    meaningPresent: "Hãy dành thời gian cho bản thân. Trong sự tĩnh lặng, bạn sẽ tìm thấy câu trả lời.",
    meaningFuture: "Trí tuệ sẽ đến với bạn. Hãy tìm kiếm sự hướng dẫn bên trong.",
    upright: "Tự reflection, trí tuệ, nội tâm",
    reversed: "Cô đơn, cô lập quá mức"
  },
  {
    id: 10,
    name: "Wheel of Fortune",
    nameVn: "Bánh Xe May Mắn",
    number: 10,
    symbol: "🎡",
    color: "#9B59B6",
    gradient: ["#9B59B6", "#8E44AD"],
    meaning: "Vận may, chu kỳ, thay đổi, số phận",
    meaningPast: "Vận may đã mỉm cười với bạn. Một chương mới đã bắt đầu.",
    meaningPresent: "Một bước ngoặt lớn đang đến. Hãy đón nhận sự thay đổi!",
    meaningFuture: "Vận may sẽ đến! Hãy sẵn sàng cho cơ hội mới.",
    upright: "Vận may, chuyển đổi, vận mệnh",
    reversed: "Xui xẻo, kháng cự thay đổi"
  },
  {
    id: 11,
    name: "Justice",
    nameVn: "Công Lý",
    number: 11,
    symbol: "⚖️",
    color: "#F1C40F",
    gradient: ["#F1C40F", "#D4AC0D"],
    meaning: "Công bằng, truth, luật pháp, cân bằng",
    meaningPast: "Bạn đã nhận được những gì xứng đáng. Công lý đã được thực thi.",
    meaningPresent: "Hãy đối xử công bằng với bản thân và người khác. Truth sẽ chiến thắng.",
    meaningFuture: "Công lý sẽ được thực thi. Hãy tin vào sự công bằng vũ trụ.",
    upright: "Công bằng, truth, cân bằng",
    reversed: "Bất công, trốn tránh trách nhiệm"
  },
  {
    id: 12,
    name: "The Hanged Man",
    nameVn: "Người Treo",
    number: 12,
    symbol: "🧘",
    color: "#1ABC9C",
    gradient: ["#1ABC9C", "#16A085"],
    meaning: "Tạm dừng, từ bỏ, góc nhìn mới, hy sinh",
    meaningPast: "Bạn đã tạm dừng để xem xét lại cuộc sống.",
    meaningPresent: "Hãy tạm dừng và nhìn mọi thứ từ góc độ khác. Đừng vội vàng.",
    meaningFuture: "Một góc nhìn mới sẽ thay đổi mọi thứ. Hãy sẵn sàng thay đổi quan điểm.",
    upright: "Tạm dừng, hy sinh, góc nhìn mới",
    reversed: "Chờ đợi, trì hoãn vô ích"
  },
  {
    id: 13,
    name: "Death",
    nameVn: "Cái Chết",
    number: 13,
    symbol: "💀",
    color: "#2C3E50",
    gradient: ["#2C3E50", "#1A252F"],
    meaning: "Kết thúc, chuyển đổi, tái sinh, biến đổi",
    meaningPast: "Một chương đã kết thúc. Điều cũ đã qua đi.",
    meaningPresent: "Một kết thúc đang diễn ra để nhường chỗ cho điều mới. Hãy buông bỏ.",
    meaningFuture: "Sự tái sinh đang chờ đợi. Hãy đón nhận sự biến đổi.",
    upright: "Kết thúc, chuyển đổi, tái sinh",
    reversed: "Kháng cự thay đổi, sợ hãi"
  },
  {
    id: 14,
    name: "Temperance",
    nameVn: "Điều Độ",
    number: 14,
    symbol: "🌈",
    color: "#3498DB",
    gradient: ["#3498DB", "#2980B9"],
    meaning: "Cân bằng, kiên nhẫn, điều độ, hòa hợp",
    meaningPast: "Bạn đã tìm được sự cân bằng trong cuộc sống.",
    meaningPresent: "Hãy tìm sự cân bằng. Điều độ là chìa khóa.",
    meaningFuture: "Sự hài hòa và cân bằng sẽ đến. Hãy kiên nhẫn.",
    upright: "Cân bằng, kiên nhẫn, điều độ",
    reversed: "Mất cân bằng, cực đoan"
  },
  {
    id: 15,
    name: "The Devil",
    nameVn: "Con Quỷ",
    number: 15,
    symbol: "😈",
    color: "#C0392B",
    gradient: ["#C0392B", "#922B21"],
    meaning: "Cám dỗ, nghiện, bóng tối, giải phóng",
    meaningPast: "Bạn đã bị cám dỗ hoặc rơi vào bẫy nào đó.",
    meaningPresent: "Hãy nhận ra những gì đang trói buộc bạn. Đã đến lúc giải phóng.",
    meaningFuture: "Bạn sẽ được giải phóng khỏi những ràng buộc. Hãy đối mặt với bóng tối.",
    upright: "Cám dỗ, nghiện, bóng tối",
    reversed: "Giải phóng, thoát khỏi giam cầm"
  },
  {
    id: 16,
    name: "The Tower",
    nameVn: "Ngọn Tháp",
    number: 16,
    symbol: "⚡",
    color: "#E74C3C",
    gradient: ["#E74C3C", "#C0392B"],
    meaning: "Đổ vỡ, giác ngộ, thay đổi đột ngột, cứu rỗi",
    meaningPast: "Một sự kiện lớn đã phá vỡ mọi thứ. Nhưng đó là cần thiết.",
    meaningPresent: "Mọi thứ đang sụp đổ để xây dựng lại. Hãy đối mặt và vượt qua.",
    meaningFuture: "Sự giác ngộ đang đến. Qua bão tố, bạn sẽ mạnh mẽ hơn.",
    upright: "Đổ vỡ, giác ngộ, thay đổi",
    reversed: "Tránh thảm họa, sợ thay đổi"
  },
  {
    id: 17,
    name: "The Star",
    nameVn: "Ngôi Sao",
    number: 17,
    symbol: "⭐",
    color: "#1ABC9C",
    gradient: ["#1ABC9C", "#16A085"],
    meaning: "Hy vọng, tin tưởng, inspiration, chữa lành",
    meaningPast: "Bạn đã giữ hy vọng và vượt qua khó khăn.",
    meaningPresent: "Hãy tin vào tương lai. Ánh sáng đang dẫn lối.",
    meaningFuture: "Hy vọng và sự chữa lành đang đến. Hãy mở lòng đón nhận.",
    upright: "Hy vọng, inspiration, chữa lành",
    reversed: "Mất hy vọng, tuyệt vọng"
  },
  {
    id: 18,
    name: "The Moon",
    nameVn: "Mặt Trăng",
    number: 18,
    symbol: "🌕",
    color: "#9B59B6",
    gradient: ["#9B59B6", "#8E44AD"],
    meaning: "Bóng tối, trực giác, ảo giác, nỗi sợ",
    meaningPast: "Có những điều mà bạn chưa nhìn thấy rõ. Nỗi sợ đã ảnh hưởng.",
    meaningPresent: "Hãy tin vào trực giác. Có thể có những điều không như vẻ bề ngoài.",
    meaningFuture: "Sự thật sẽ được tiết lộ. Đừng để nỗi sợ chi phối.",
    upright: "Bóng tối, trực giác, ảo giác",
    reversed: "Giải phóng nỗi sợ, truth"
  },
  {
    id: 19,
    name: "The Sun",
    nameVn: "Mặt Trời",
    number: 19,
    symbol: "☀️",
    color: "#F39C12",
    gradient: ["#F39C12", "#E67E22"],
    meaning: "Vui vẻ, thành công, sức sống, tích cực",
    meaningPast: "Một thời gian vui vẻ và thành công đã qua.",
    meaningPresent: "Hãy tận hưởng khoảnh khắc này! Mọi thứ đang rực rỡ.",
    meaningFuture: "Thành công và niềm vui đang chờ đợi. Hãy tỏa sáng!",
    upright: "Vui vẻ, thành công, sức sống",
    reversed: "Buồn bã, thất bại tạm thời"
  },
  {
    id: 20,
    name: "Judgement",
    nameVn: "Phán Xét",
    number: 20,
    symbol: "🔔",
    color: "#E91E63",
    gradient: ["#E91E63", "#C2185B"],
    meaning: "Tái sinh, self-reflection, gọi thức, cơ hội",
    meaningPast: "Đã đến lúc nhìn lại và đánh giá bản thân.",
    meaningPresent: "Hãy tự reflection. Đây là lúc của sự thức tỉnh.",
    meaningFuture: "Một cơ hội mới sẽ đến. Hãy sẵn sàng cho sự tái sinh.",
    upright: "Tái sinh, self-reflection, cơ hội",
    reversed: "Tự phê phán, hoài nghi"
  },
  {
    id: 21,
    name: "The World",
    nameVn: "Thế Giới",
    number: 21,
    symbol: "🌍",
    color: "#2ECC71",
    gradient: ["#2ECC71", "#27AE60"],
    meaning: "Hoàn thành, thành tựu, toàn diện, kết thúc",
    meaningPast: "Bạn đã hoàn thành một hành trình lớn.",
    meaningPresent: "Bạn đang ở đỉnh cao! Hãy tận hưởng thành quả.",
    meaningFuture: "Một chương mới đang chờ đợi. Hành trình đã hoàn thành.",
    upright: "Hoàn thành, thành tựu, toàn diện",
    reversed: "Chưa hoàn thành, trì hoãn"
  }
];

const POSITIONS = [
  { id: 'past', name: 'Quá Khứ', nameEn: 'Past', description: 'Ảnh hưởng từ quá khứ' },
  { id: 'present', name: 'Hiện Tại', nameEn: 'Present', description: 'Tình huống hiện tại' },
  { id: 'future', name: 'Tương Lai', nameEn: 'Future', direction: 'hướng về phía trước', description: 'Kết quả dự kiến' }
];

const LOCAL_INTERPRETATION_PROMPT = (cards, question) => {
  const card1 = TAROT_CARDS.find(c => c.name === cards[0]);
  const card2 = TAROT_CARDS.find(c => c.name === cards[1]);
  const card3 = TAROT_CARDS.find(c => c.name === cards[2]);

  return `
    <h2>🔮 Kết Quả Bói Bài Tarot</h2>
    
    <h3>Câu hỏi của bạn</h3>
    <blockquote>"${question || 'Không có câu hỏi cụ thể, hãy đón nhận thông điệp từ vũ trụ'}"</blockquote>
    
    <hr>
    
    <h3>📌 Tổng Quan Ba Lá Bài</h3>
    <table>
      <thead>
        <tr>
          <th>Vị trí</th>
          <th>Lá bài</th>
          <th>Ý nghĩa</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Quá Khứ</strong></td>
          <td><span class="card-highlight">${card1.nameVn}</span><br><em>${card1.name}</em></td>
          <td>${card1.meaningPast}</td>
        </tr>
        <tr>
          <td><strong>Hiện Tại</strong></td>
          <td><span class="card-highlight">${card2.nameVn}</span><br><em>${card2.name}</em></td>
          <td>${card2.meaningPresent}</td>
        </tr>
        <tr>
          <td><strong>Tương Lai</strong></td>
          <td><span class="card-highlight">${card3.nameVn}</span><br><em>${card3.name}</em></td>
          <td>${card3.meaningFuture}</td>
        </tr>
      </tbody>
    </table>
    
    <hr>
    
    <h3>🔗 Mối Liên Hệ Giữa 3 Lá</h3>
    <p><strong>${card1.name} → ${card2.name} → ${card3.name}</strong></p>
    <p>Từ <em>${card1.nameVn}</em> (${card1.meaning.toLowerCase()}), qua <em>${card2.nameVn}</em> (${card2.meaning.toLowerCase()}), đến <em>${card3.nameVn}</em> (${card3.meaning.toLowerCase()}).</p>
    <p>Đây là câu chuyện về <strong>${card1.name.toLowerCase()}</strong> dẫn lối đến <strong>${card3.name.toLowerCase()}</strong>, với <strong>${card2.name}</strong> là điểm chuyển mình quan trọng trong hành trình của bạn.</p>
    
    <hr>
    
    <h3>💫 Thông Điệp</h3>
    <p><strong>${card2.nameVn}</strong> đang ở trung tâm cuộc sống của bạn bây giờ.</p>
    <p>Từ những gì đã qua, bạn đã học được <strong>${card1.meaning.toLowerCase()}</strong>. Bây giờ là lúc <strong>${card2.meaning.toLowerCase()}</strong>. Và trong tương lai, <strong>${card3.nameVn}</strong> sẽ mang đến <strong>${card3.meaning.toLowerCase()}</strong>.</p>
    
    <hr>
    
    <h3>🌟 Lời Khuyên</h3>
    <ol>
      <li><strong>Từ Quá Khứ:</strong> ${card1.meaningPast}</li>
      <li><strong>Cho Hiện Tại:</strong> ${card2.meaningPresent}</li>
      <li><strong>Hướng Tới Tương Lai:</strong> ${card3.meaningFuture}</li>
    </ol>
    
    <hr>
    
    <p style="text-align: center; color: var(--color-gold); font-style: italic;">
      ✨ Chúc bạn may mắn trên hành trình! ✨
    </p>
  `;
};

const AI_PROMPT = (cards, question) => {
  const card1 = TAROT_CARDS.find(c => c.name === cards[0]);
  const card2 = TAROT_CARDS.find(c => c.name === cards[1]);
  const card3 = TAROT_CARDS.find(c => c.name === cards[2]);

  return `Bạn là một chuyên gia Tarot với 20 năm kinh nghiệm đọc bài. Hãy phân tích 3 lá bài Major Arcana sau và trả lời bằng HTML (không dùng markdown).

Câu hỏi của người xem: "${question || 'Không có câu hỏi cụ thể, hãy đưa ra thông điệp tổng quát'}"

---

### Ba Lá Bài Đã Chọn:

**Lá 1 - QUÁ KHỨ (Past):**
- Tên: ${card1.name} (${card1.nameVn})
- Số: ${card1.number}
- Ý nghĩa cơ bản: ${card1.meaning}
- Ý nghĩa ở vị trí Quá khứ: ${card1.meaningPast}

**Lá 2 - HIỆN TẠI (Present):**
- Tên: ${card2.name} (${card2.nameVn})
- Số: ${card2.number}
- Ý nghĩa cơ bản: ${card2.meaning}
- Ý nghĩa ở vị trí Hiện tại: ${card2.meaningPresent}

**Lá 3 - TƯƠNG LAI (Future):**
- Tên: ${card3.name} (${card3.nameVn})
- Số: ${card3.number}
- Ý nghĩa cơ bản: ${card3.meaning}
- Ý nghĩa ở vị trí Tương lai: ${card3.meaningFuture}

---

### Yêu cầu phân tích:

1. **Phân tích từng lá bài** trong vị trí của nó (Quá khứ, Hiện tại, Tương lai)
2. **Khám phá mối liên hệ** giữa 3 lá - chúng kể câu chuyện gì?
3. **Thông điệp tổng quát** cho người hỏi
4. **Lời khuyên thực tế** dựa trên 3 lá bài

---

### Format yêu cầu:
- Viết bằng tiếng Việt
- **TRẢ LỜI BẰNG HTML** (dùng các thẻ: h2, h3, h4, p, ul, li, blockquote, hr, table, tr, td, th)
- Giọng văn truyền cảm hứng, sâu sắc
- Có emoji phù hợp
- Dùng tiêu đề rõ ràng (h2, h3)
- Mỗi phần 2-4 câu ngắn gọn, dễ hiểu
- Không quá dài (khoảng 300-500 từ)
- Dùng class="card-highlight" cho tên các lá bài
- Dùng blockquote cho câu hỏi
- Dùng hr để phân cách các phần`;
};

const STORAGE_KEYS = {
  provider: 'tarot_ai_provider',
  apiKey: 'tarot_api_key',
  history: 'tarot_history',
  openRouterModel: 'tarot_openrouter_model'
};

const AI_PROVIDERS = {
  local: {
    id: 'local',
    name: '🔮 Local',
    description: 'Phân tích cơ bản - Miễn phí',
    needsKey: false
  },
  openai: {
    id: 'openai',
    name: '🤖 OpenAI (GPT)',
    description: 'Phân tích sâu - Cần API Key',
    needsKey: true,
    endpoint: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-4o-mini',
    headers: (key) => ({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`
    }),
    body: (prompt) => ({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1000
    })
  },
  google: {
    id: 'google',
    name: '🌐 Google Gemini 2.5 Flash Lite',
    description: 'Nhanh - Cần API Key',
    needsKey: true,
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite-preview-09-2025:generateContent',
    keyParam: 'key',
    headers: (key) => ({
      'Content-Type': 'application/json'
    }),
    body: (prompt) => ({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2000
      }
    })
  },
  openrouter: {
    id: 'openrouter',
    name: '🧩 OpenRouter',
    description: 'Nhiều model (có free models*) - Cần API Key',
    needsKey: true,
    endpoint: 'https://openrouter.ai/api/v1/chat/completions',
    // Default free model (OpenRouter free list can change over time).
    model: 'google/gemma-2-9b-it:free',
    headers: (key) => ({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`
      // Optional (recommended) headers per OpenRouter docs:
      // 'HTTP-Referer': location.origin,
      // 'X-Title': 'Tarot Game'
    }),
    // body(model, prompt) lets UI override the model without changing code.
    body: (model, prompt) => ({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1000
    })
  }
};
