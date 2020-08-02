/* *********************************************/
/********************************************  /
//
// @date
//
// Project - Gordos Isometricos
//
//  if (!bug)
//	@author Lopídio (I love America)
//  else
//	@author Unkwonn
//
//
//  Good Luck!
** *********************************/
/* *******************************/


#include "Jogo.h"
#include <allegro.h>

Jogo* Jogo::instance = 0;
int Jogo::LINHAS = 30;
int Jogo::COLUNAS = 40;


Jogo::Jogo()
{
        allegro_init();
        set_color_depth(32);
        somaAcumulada = 0;
        UPDATE_TIME = 0.1;
        cenario = new Cenario(); //Cenário precisa ser criado antes, para que o jogo saiba a resolução da fase
        initialize();
        snake = new Snake();
}

Jogo::~Jogo()
{
        delete cenario;
        delete snake;
}

Jogo* Jogo::getInstance()
{
        if (!instance)
        {
                instance = new Jogo();
        }
        return instance;
}

/** @brief unload
  *
  * @todo: document this function
  */
void Jogo::unload()
{
        destroy_bitmap(buffer);
        cenario->unload();
        snake->unload();
}

/** @brief gameLoop
  *
  * @todo: document this function
  */
void Jogo::gameLoop()
{
        start = clock();
        while (!key[KEY_ESC] && snake->isAlive())
        {
                update();
                draw();
        }
}

/** @brief load
  *
  * @todo: document this function
  */
void Jogo::load()
{
        buffer = create_bitmap(SCREEN_W, SCREEN_H);
        cenario->load();
        snake->load();
}

void Jogo::initialize()
{
        if (set_gfx_mode(GFX_AUTODETECT_WINDOWED,COLUNAS*TILE_DIMENSAO,LINHAS*TILE_DIMENSAO,0,0))
        {
                allegro_message("%s", allegro_error);
                allegro_exit();
                exit(1);
        }

        set_window_title("Gui Super Snake");
        install_keyboard();
}

/** @brief draw
  *
  * @todo: document this function
  */
void Jogo::draw()
{
        cenario->draw(buffer);
        snake->draw(buffer);
        draw_sprite(screen, buffer,0,0);
}

/** @brief update
  *
  * @todo: document this function
  */
void Jogo::update()
{
        somaAcumulada += (double)(clock() - start)/CLOCKS_PER_SEC;
        start = clock();
        snake->update(somaAcumulada > UPDATE_TIME, cenario);
        if (somaAcumulada >= UPDATE_TIME)
        {
                 somaAcumulada -= UPDATE_TIME;
                UPDATE_TIME -= 0.000005;
        }
}

/** @brief run
  *
  * @todo: document this function
  */
void Jogo::run()
{
        load();
        gameLoop();
        while (!key[KEY_ESC]);
        unload();
        delete this;
        allegro_exit();
}

