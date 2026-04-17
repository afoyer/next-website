import "./PantonifySwatch.scss";

const songs = [
  {
    artist: "DAFT PUNK",
    title: "Give Life Back To Music",
    hex: "242525",
    img: "https://upload.wikimedia.org/wikipedia/en/2/26/Daft_Punk_-_Random_Access_Memories.png"
  },
  {
    artist: "DUA LIPA",
    title: "Levitating",
    hex: "4E4546",
    img: "https://upload.wikimedia.org/wikipedia/en/f/f5/Dua_Lipa_-_Future_Nostalgia_%28Official_Album_Cover%29.png"
  }
];

const steps = [
  "Connect Spotify",
  "Pull your top tracks",
  "Extract dominant color",
  "Match to nearest Pantone",
  "Get your swatch",
];

const PantonifySwatch = () => {

  return (
    <div className="pantonify-container">
      <div className="card">
        <header className="card__header">
          <h1>PANTONIFY©</h1>
        </header>

        <main className="card__content">
          {songs.map((song, i) => (
            <section key={i} className="song-block">
              <div
                className="song-block__color"
                style={{ backgroundColor: `#${song.hex}` }}
              >
                <img src={song.img} alt={song.artist} />
              </div>
            </section>
          ))}
        </main>

        <div className="swatch-steps">
          {steps.map((label, i) => (
            <span key={i} className="swatch-steps__item">
              <span className="swatch-steps__badge">{i + 1}</span>
              <span className="swatch-steps__label">{label}</span>
              {i < steps.length - 1 && (
                <span className="swatch-steps__arrow">→</span>
              )}
            </span>
          ))}
        </div>

        <footer className="card__footer">
          <div className="logo-badge"></div>
        </footer>
      </div>
    </div>
  );
};

export default PantonifySwatch;
