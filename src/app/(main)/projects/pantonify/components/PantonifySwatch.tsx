import "./PantonifySwatch.scss";

const songs = [
  {
    hex: "242525",
    artist: "DAFT PUNK",
    title: "Give Life Back To Music",
    img: "https://upload.wikimedia.org/wikipedia/en/2/26/Daft_Punk_-_Random_Access_Memories.png",
  },
  {
    hex: "4E4546",
    artist: "DUA LIPA",
    title: "Levitating",
    img: "https://upload.wikimedia.org/wikipedia/en/f/f5/Dua_Lipa_-_Future_Nostalgia_%28Official_Album_Cover%29.png",
  },
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
              {/* Color swatch bar — album art fades in on the right */}
              <div
                className="song-block__swatch"
                style={{ backgroundColor: `#${song.hex}` }}
              >
                {/* White text overlay inside the swatch — small at natural scale,
                    scales up proportionally with tl3 CSS scale to match 364-9 */}
                <div className="song-block__inner-text">
                  <span className="song-block__inner-artist">{song.artist}</span>
                  <span className="song-block__inner-title">{song.title}</span>
                </div>
                <img
                  src={song.img}
                  alt=""
                  className="song-block__art"
                />
              </div>

              {/* Info row below swatch: artist + hex on left, song title on right */}
              <div className="song-block__info">
                <div className="song-block__meta">
                  <span className="song-block__artist">{song.artist}</span>
                  <span className="song-block__hex">{song.hex}</span>
                </div>
                <span className="song-block__title">{song.title}</span>
              </div>
            </section>
          ))}
        </main>

        <footer className="card__footer">
          <div className="logo-badge" />
        </footer>
      </div>
    </div>
  );
};

export default PantonifySwatch;
