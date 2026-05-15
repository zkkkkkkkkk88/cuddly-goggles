export default function Hero() {
  return (
    <section className="relative text-center pt-28 pb-16 px-6">
      <div className="deco-divider max-w-xs mx-auto mb-8">
        <div className="deco-diamond" />
      </div>

      <p className="text-deco-brass text-xs font-bold tracking-[0.3em] uppercase mb-6">
        由 DeepSeek AI 驱动
      </p>

      <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-deco-navy max-w-3xl mx-auto leading-none tracking-tight">
        用 AI 分析
        <br />
        <span className="italic text-deco-brass" style={{ fontFamily: "'Playfair Display', 'Noto Serif SC', serif" }}>
          &amp; 优化
        </span>
        {" "}你的简历
      </h1>

      <p className="mt-8 text-lg text-deco-warmgray max-w-lg mx-auto leading-relaxed">
        上传 PDF，即刻获得评分、ATS 兼容性检测、关键词建议以及专业优化版本。
      </p>

      <div className="deco-divider max-w-xs mx-auto mt-10">
        <div className="deco-diamond" />
      </div>
    </section>
  );
}
