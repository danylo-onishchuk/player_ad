'use strict';

class Player {
  vastUrl: string;
  type: string;

  constructor(vastUrl: string) {
    this.vastUrl = vastUrl;
    this.type = 'video/mp4';
  }

  async load(): Promise<Document> {
    const response: Response = await window.fetch(this.vastUrl)
    const data: string = await response.text();
    const parser: DOMParser = new window.DOMParser();

    return parser.parseFromString(data, 'application/xml');
  }

  play(): void {
    const player: HTMLMediaElement | null = document.querySelector('#player');
    const play: HTMLButtonElement | null = document.querySelector('#play');

    if (player && play) {
      play.addEventListener('click', () => player.play());
    }
  }

  pause(): void {
    const player: HTMLMediaElement | null = document.querySelector('#player');
    const pause: HTMLButtonElement | null = document.querySelector('#pause');

    if (player && pause) {
      pause.addEventListener('click', () => player.pause());
    }
  }

  close(): void {
    const player: HTMLMediaElement | null = document.querySelector('#player');
    const controls: HTMLElement | null = document.querySelector('#controls');
    const close: HTMLButtonElement | null = document.querySelector('#close');

    if (player && controls && close) {
      close.addEventListener('click', () => {
        player.remove();
        controls.remove();

        document.body.insertAdjacentHTML('beforeend', `
              <button id="start" class="btn btn-primary mainButton">
                <i class="bi bi-caret-right-square"></i>
                Start watching
              </button>
            `);
        this.start();
      });
    }
  }

  start(): void {
    this.load()
      .then(response => {
        const videosCollection: NodeListOf<Element>
          = response.querySelectorAll('MediaFile');
        const videos: Element[] = Array.from(videosCollection);
        const needVideo: Element | undefined = videos.find(video => (
          video.getAttribute('type') === this.type
        ));

        if (needVideo) {
          const link: string | null = needVideo.textContent;
          const start: HTMLButtonElement | null = document.querySelector('#start');

          if (start) {
            start.addEventListener('click', () => {
              document.body.insertAdjacentHTML('beforeend', `
                <video id="player" class="player">
                  <source src=${link}>
                </video>
                <div id="controls" class="controls">
                  <button id="play" class="btn btn-primary">
                    <i class="bi bi-play-fill"></i>
                    Play
                  </button>
                  <button id="pause" class="btn btn-primary">
                    <i class="bi bi-pause-fill"></i>
                    Pause
                  </button>
                  <button id="close" class="btn btn-primary">
                    <i class="bi bi-door-open-fill"></i>
                    Close
                  </button>
                </div>
              `);
              start.remove();
              this.play();
              this.pause();
              this.close();
            });
          }
        }
      });
  }
}

const myPlayer = new Player(
  'https://cdn.admixer.net/public/player%2Fregular-preroll.xml'
);

myPlayer.start();
