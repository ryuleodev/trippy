INSERT INTO itineraries (
  id,
  trip_id,
  date,
  start_time,
  end_time,
  title,
  memo,
  cost,
  cost_currency,
  created_at
) VALUES
-- 2026-03-20（金）
('7c61b2d4-7f3e-4cc2-a8a1-2c8b7ad30101', 'e9785df0-d6b5-42b3-8298-f3ebb8c4ac75', '2026-03-20', '18:35', NULL, '福岡空港→博多へ移動', '地下鉄 約5分', 0, 'JPY', CURRENT_TIMESTAMP),
('7c61b2d4-7f3e-4cc2-a8a1-2c8b7ad30102', 'e9785df0-d6b5-42b3-8298-f3ebb8c4ac75', '2026-03-20', '18:50', NULL, '博多→ホテル移動', '徒歩 or タクシー', 0, 'JPY', CURRENT_TIMESTAMP),
('7c61b2d4-7f3e-4cc2-a8a1-2c8b7ad30103', 'e9785df0-d6b5-42b3-8298-f3ebb8c4ac75', '2026-03-20', '19:45', NULL, '博多もつ鍋おおやま 本店', '予約済', 0, 'JPY', CURRENT_TIMESTAMP),
('7c61b2d4-7f3e-4cc2-a8a1-2c8b7ad30104', 'e9785df0-d6b5-42b3-8298-f3ebb8c4ac75', '2026-03-20', '21:30', NULL, '中洲屋台', '軽く1〜2軒', 0, 'JPY', CURRENT_TIMESTAMP),
('7c61b2d4-7f3e-4cc2-a8a1-2c8b7ad30105', 'e9785df0-d6b5-42b3-8298-f3ebb8c4ac75', '2026-03-20', '22:30', NULL, 'ラーメンで締め', '', 0, 'JPY', CURRENT_TIMESTAMP),
('7c61b2d4-7f3e-4cc2-a8a1-2c8b7ad30106', 'e9785df0-d6b5-42b3-8298-f3ebb8c4ac75', '2026-03-20', '23:30', NULL, 'Boxi Hakata チェックイン', '宿泊', 0, 'JPY', CURRENT_TIMESTAMP),

-- 2026-03-21（土）
('7c61b2d4-7f3e-4cc2-a8a1-2c8b7ad30107', 'e9785df0-d6b5-42b3-8298-f3ebb8c4ac75', '2026-03-21', '09:00', '11:00', '太宰府天満宮', '午前観光の第一候補', 0, 'JPY', CURRENT_TIMESTAMP),
('7c61b2d4-7f3e-4cc2-a8a1-2c8b7ad30108', 'e9785df0-d6b5-42b3-8298-f3ebb8c4ac75', '2026-03-21', '12:00', '13:00', '福岡で昼食', '明太子 / 水炊き / うどん', 0, 'JPY', CURRENT_TIMESTAMP),
('7c61b2d4-7f3e-4cc2-a8a1-2c8b7ad30109', 'e9785df0-d6b5-42b3-8298-f3ebb8c4ac75', '2026-03-21', '14:30', '15:10', '博多→熊本', '新幹線移動 約40分', 0, 'JPY', CURRENT_TIMESTAMP),
('7c61b2d4-7f3e-4cc2-a8a1-2c8b7ad30110', 'e9785df0-d6b5-42b3-8298-f3ebb8c4ac75', '2026-03-21', '16:30', '18:00', '熊本城', '夕方観光', 0, 'JPY', CURRENT_TIMESTAMP),
('7c61b2d4-7f3e-4cc2-a8a1-2c8b7ad30111', 'e9785df0-d6b5-42b3-8298-f3ebb8c4ac75', '2026-03-21', '19:00', NULL, '熊本で夜ごはん', '馬刺し / 熊本ラーメン', 0, 'JPY', CURRENT_TIMESTAMP),
('7c61b2d4-7f3e-4cc2-a8a1-2c8b7ad30112', 'e9785df0-d6b5-42b3-8298-f3ebb8c4ac75', '2026-03-21', '21:00', NULL, '東横イン熊本駅前 チェックイン', '宿泊', 0, 'JPY', CURRENT_TIMESTAMP),

-- 2026-03-22（日）
('7c61b2d4-7f3e-4cc2-a8a1-2c8b7ad30113', 'e9785df0-d6b5-42b3-8298-f3ebb8c4ac75', '2026-03-22', '09:00', NULL, '熊本駅でレンタカー', '出発', 0, 'JPY', CURRENT_TIMESTAMP),
('7c61b2d4-7f3e-4cc2-a8a1-2c8b7ad30114', 'e9785df0-d6b5-42b3-8298-f3ebb8c4ac75', '2026-03-22', '09:15', '11:15', '熊本→黒川温泉', '車移動 約2時間', 0, 'JPY', CURRENT_TIMESTAMP),
('7c61b2d4-7f3e-4cc2-a8a1-2c8b7ad30115', 'e9785df0-d6b5-42b3-8298-f3ebb8c4ac75', '2026-03-22', '11:30', '15:00', '黒川温泉散策', '食べ歩き・カフェ・入湯手形で露天風呂巡り', 0, 'JPY', CURRENT_TIMESTAMP),
('7c61b2d4-7f3e-4cc2-a8a1-2c8b7ad30116', 'e9785df0-d6b5-42b3-8298-f3ebb8c4ac75', '2026-03-22', '15:30', NULL, '奥阿蘇の宿 やまなみ チェックイン', '15:00〜16:00 IN 理想', 0, 'JPY', CURRENT_TIMESTAMP),

-- 2026-03-23（月）
('7c61b2d4-7f3e-4cc2-a8a1-2c8b7ad30117', 'e9785df0-d6b5-42b3-8298-f3ebb8c4ac75', '2026-03-23', '10:00', NULL, '奥阿蘇の宿 やまなみ チェックアウト', '朝食・温泉後に出発', 0, 'JPY', CURRENT_TIMESTAMP),
('7c61b2d4-7f3e-4cc2-a8a1-2c8b7ad30118', 'e9785df0-d6b5-42b3-8298-f3ebb8c4ac75', '2026-03-23', '10:00', '11:00', 'やまなみ→阿蘇山方面', '車移動 約40〜60分', 0, 'JPY', CURRENT_TIMESTAMP),
('7c61b2d4-7f3e-4cc2-a8a1-2c8b7ad30119', 'e9785df0-d6b5-42b3-8298-f3ebb8c4ac75', '2026-03-23', '11:00', '13:00', '阿蘇山観光', '草千里ヶ浜・火口（行ければ）', 0, 'JPY', CURRENT_TIMESTAMP),
('7c61b2d4-7f3e-4cc2-a8a1-2c8b7ad30120', 'e9785df0-d6b5-42b3-8298-f3ebb8c4ac75', '2026-03-23', '13:15', '14:45', '阿蘇→熊本空港', '車移動 約1.5時間', 0, 'JPY', CURRENT_TIMESTAMP),
('7c61b2d4-7f3e-4cc2-a8a1-2c8b7ad30121', 'e9785df0-d6b5-42b3-8298-f3ebb8c4ac75', '2026-03-23', '15:00', '18:30', '熊本空港', 'お土産・夕飯', 0, 'JPY', CURRENT_TIMESTAMP),
('7c61b2d4-7f3e-4cc2-a8a1-2c8b7ad30122', 'e9785df0-d6b5-42b3-8298-f3ebb8c4ac75', '2026-03-23', '20:35', NULL, '熊本→東京', 'フライト', 0, 'JPY', CURRENT_TIMESTAMP);