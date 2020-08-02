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


#include "Snake.h"

BITMAP* Celula::iHorizontal = NULL;
BITMAP* Celula::iVertical = NULL;
BITMAP* Celula::iCabeca = NULL;
BITMAP* Celula::iEsqCima = NULL;
BITMAP* Celula::iEsqBaixo = NULL;
BITMAP* Celula::iDirCima = NULL;
BITMAP* Celula::iDirBaixo = NULL;

int Snake::initialPointX = 1;
int Snake::initialPointY = 4;

int horizontal(eDirecao direcao)
{
        if (direcao == dCima || direcao == dBaixo)
                return 0;
        if (direcao == dEsquerda)
                return -1;
        return 1;

}

int vertical(eDirecao direcao)
{
        if (direcao == dCima)
                return -1;
         if  (direcao == dBaixo)
                return 1;
        return 0;

}

Snake::Snake()
{
        Celula cabeca;
        cabeca.x = initialPointX;
        cabeca.y = initialPointY;
        corpo.push_front(cabeca);
        direcao = futuraDirecao = dDireita;
        alive = true;
        pontuacao = 0;
}

Snake::~Snake()
{
        corpo.clear();
}

/** @brief selfCollision
  *
  * @todo: document this function
  */
void Snake::selfCollision()
{
        Celula nextStep;
        nextStep.x = (corpo.begin()->x + horizontal(direcao) + Jogo::COLUNAS)%Jogo::COLUNAS;
        nextStep.y = (corpo.begin()->y + vertical(direcao) + Jogo::LINHAS)%Jogo::LINHAS;
        for (list<Celula>::iterator it = corpo.begin(); it != corpo.end(); it++)
        {
                if (it->x == nextStep.x && it->y == nextStep.y)
                        alive = false;
        }
}

/** @brief input
  *
  * @todo: document this function
  */
void Snake::input()
{
        direcaoAnterior = direcao;
        if (key[KEY_UP] && direcao != dBaixo)
        {
                futuraDirecao = dCima;
        }
        else if (key[KEY_DOWN] && direcao != dCima)
        {
                futuraDirecao = dBaixo;
        }
        else if (key[KEY_LEFT] && direcao != dDireita)
        {
                futuraDirecao = dEsquerda;
        }
        else if (key[KEY_RIGHT] && direcao != dEsquerda)
        {
                futuraDirecao = dDireita;
        }
}

/** @brief isAlive
  *
  * @todo: document this function
  */
bool Snake::isAlive() const
{
        return alive;
}

/** @brief unload
  *
  * @todo: document this function
  */
void Snake::unload()
{
        Celula::unload();
}

/** @brief load
  *
  * @todo: document this function
  */
void Snake::load()
{
        Celula::load();
}

/** @brief update
  *
  * @todo: document this function
  */
void Snake::update(bool update, Cenario* cenario)
{
        input();
        if (update)
        {
                direcao = futuraDirecao;
                selfCollision();

                Celula nextStep;
                nextStep.x = (corpo.begin()->x + horizontal(direcao)+ Jogo::COLUNAS)%Jogo::COLUNAS;
                nextStep.y = (corpo.begin()->y + vertical(direcao) + Jogo::LINHAS)%Jogo::LINHAS;
                nextStep.imagem = Celula::imagemFromDirecao(direcao, direcao);
                corpo.begin()->imagem = Celula::imagemFromDirecao(direcao, direcaoAnterior);

                eMatrixCode projecao = cenario->getCode(nextStep.y, nextStep.x);
                switch (projecao)
                {
                        case mParede:
                                        alive = false;
                                break;
                        case mComida:
                                        corpo.push_front(nextStep);
                                        pontuacao++;
                                        cenario->snakeComeu(nextStep.y, nextStep.x);
                                break;
                        case mVazio:
                                        corpo.push_front(nextStep);
                                        corpo.pop_back();
                                break;
                        case mBuraco:
                                        Ponto saida  = cenario->getSaidaDoBuraco(nextStep.x, nextStep.y);
                                        nextStep.x = saida.x;
                                        nextStep.y = saida.y;
                                        corpo.push_front(nextStep);
                                        corpo.pop_back();
                                break;
                }

        }
}

/** @brief draw
  *
  * @todo: document this function
  */
void Snake::draw(BITMAP* buffer) const
{
        list<Celula>::const_iterator it = corpo.begin();
        pivot_sprite(buffer, Celula::iCabeca, it->x*TILE_DIMENSAO + 5, it->y*TILE_DIMENSAO + 5, 5, 5, itofix(64*direcao));

        it++;
        for (; it != corpo.end(); it++)
        {
                draw_sprite(buffer, it->imagem, it->x*TILE_DIMENSAO, it->y*TILE_DIMENSAO);
        }
        textprintf_centre_ex(buffer, font, SCREEN_W/2, 0, makecol(255,255,255), -1, "Score: %d", pontuacao);
}

BITMAP* Celula::imagemFromDirecao(eDirecao atual, eDirecao anterior)
{
        if (atual == anterior)
        {
                if (atual == dEsquerda || atual == dDireita)
                        return iHorizontal;
                else
                        return iVertical;
        }
        if ((atual == dCima && anterior == dDireita) || (atual == dEsquerda && anterior == dBaixo))
                return iEsqCima;
        if ((atual == dCima && anterior == dEsquerda) || (atual == dDireita && anterior == dBaixo))
                return iDirCima;
        if ((atual == dEsquerda && anterior == dCima) || (atual == dBaixo && anterior == dDireita))
                return iEsqBaixo;
        return iDirBaixo;
}

/** @brief getPontuacao
  *
  * @todo: document this function
  */
unsigned int Snake::getPontuacao() const
{
        return pontuacao;
}

/** @brief unload
  *
  * @todo: document this function
  */
void Celula::unload()
{
        destroy_bitmap(iHorizontal);
        destroy_bitmap (iVertical);
        destroy_bitmap(iCabeca);
        destroy_bitmap(iEsqCima);
        destroy_bitmap(iEsqBaixo);
        destroy_bitmap(iDirCima);
        destroy_bitmap(iDirBaixo);
}

/** @brief load
  *
  * @todo: document this function
  */
void Celula::load()
{
        iCabeca = load_bitmap("cabeca.bmp", NULL);
        iHorizontal = load_bitmap("horizontal.bmp", NULL);
        iDirBaixo = load_bitmap("curva.bmp", NULL);
        iVertical = create_bitmap(10,10);
        clear_to_color(iVertical, makecol(255,0,255)); // Pintua necessária para deixar o fundo transparente
        pivot_sprite(iVertical, iHorizontal, 5,5, 5,5, itofix(64)); //64 = 90º
        iEsqBaixo  = create_bitmap(10,10);
        clear_to_color(iEsqBaixo, makecol(255,0,255));
        pivot_sprite(iEsqBaixo, iDirBaixo, 5,5, 5,5, itofix(64)); //64 = 90º
        iEsqCima  = create_bitmap(10,10);
        clear_to_color(iEsqCima, makecol(255,0,255));
        pivot_sprite(iEsqCima, iEsqBaixo, 5,5, 5,5, itofix(64)); //64 = 90º
        iDirCima  = create_bitmap(10,10);
        clear_to_color(iDirCima, makecol(255,0,255));
        pivot_sprite(iDirCima, iEsqCima, 5,5, 5,5, itofix(64)); //64 = 90º
}

