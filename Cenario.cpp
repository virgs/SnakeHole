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


#include "Cenario.h"
#include "Jogo.h"
#include <time.h>
#include <stdio.h>


BITMAP* carregarBitmap(const char* fileName)
{
        BITMAP* retorno = load_bitmap(fileName, NULL);
        if (!retorno)
        {
                allegro_message("Erro ao carregar: %s", fileName);
                exit(1);
        }
        return retorno;
}

Cenario::Cenario()
{
        srand(time(NULL));
        BITMAP* fase = carregarBitmap("cenario.bmp");

        Jogo::LINHAS = fase->h;
        Jogo::COLUNAS = fase->w;

        matriz = new eMatrixCode*[Jogo::LINHAS];
        for (int i = 0; i < Jogo::LINHAS; i++)
                matriz[i] = new eMatrixCode[Jogo::COLUNAS];
        list<Ponto> pontos; //Armazenar a localização dos buracos
        for (int i = 0; i < Jogo::LINHAS; i++)
        {
                for (int j = 0; j < Jogo::COLUNAS; j++)
                {
                        int cor = getpixel(fase, j, i);
                        if (cor == 0) //PRETO
                        {
                                matriz[i][j] = mParede;
                        }
                        else if (cor == makecol(255,255,255)) //VAZIO = BRANCO
                                matriz[i][j] = mVazio;
                        else if (cor == makecol(128,128,128)) //Posição inicial
                        {
                                Snake::initialPointX = j;
                                Snake::initialPointY = i;
                                matriz[i][j] = mVazio;
                        }

                        else
                        {
                                matriz[i][j] = mVazio;
                                Ponto p;
                                p.x = j;
                                p.y = i;
                                p.cor = cor;
                                pontos.push_front(p);
                        }
                }
        }
        criarBuracos(pontos);
        destroy_bitmap(fase);
        criarComida();
}

Cenario::~Cenario()
{
        for (int i = 0; i < Jogo::LINHAS; i++)
                delete[] matriz[i];
        delete[] matriz;

        destroy_bitmap(vazioBitmap);
        destroy_bitmap(paredeBitmap);
        destroy_bitmap(comidaBitmap);
        vazioBitmap = NULL;
        comidaBitmap = NULL;
        paredeBitmap = NULL;
}

/** @brief criarBuracos
  *
  * @todo: document this function
  */
void Cenario::criarBuracos(list<Ponto>& pontos)
{
        for (list<Ponto>::iterator it1 = pontos.begin(); it1 != pontos.end(); it1++ ) //Associa um buraco à outro buraco!!
        {
                list<Ponto>::iterator it2 = it1;
                it2++;
                for (; it2 != pontos.end(); it2++ )
                {
                        if (it1->cor == it2->cor)
                        {
                                Buraco b;
                                b.a.x = it1->x;
                                b.a.y = it1->y;
                                b.a.cor = it1->cor;
                                b.b.x = it2->x;
                                b.b.y = it2->y;
                                b.b.cor = it2->cor;
                                buracos.push_back(b);
                                pontos.erase(it2); //Remove o buraco 2
                                break; //E pula para o próximo
                        }
                }

        }


        for (list<Buraco>::iterator it = buracos.begin(); it != buracos.end(); it++ ) //Desenha os buracos na matriz
        {
                Ponto a = it->a;
                matriz[a.y][a.x] = mBuraco;
                Ponto b = it->b;
                matriz[b.y][b.x] = mBuraco;
        }

}

/** @brief draw
  *
  * @todo: document this function
  */
void Cenario::draw(BITMAP* buffer) const
{
        drawBuracosCor(buffer);
        for (int i = 0; i < Jogo::LINHAS; i++)
                for (int j = 0; j < Jogo::COLUNAS; j++)
                {
                        BITMAP* bitmapASerImpresso;
                        switch (matriz[i][j])
                        {
                                case mParede:
                                                bitmapASerImpresso = paredeBitmap;
                                        break;
                                case mVazio:
                                                bitmapASerImpresso = vazioBitmap;
                                        break;
                                case mComida:
                                                bitmapASerImpresso = comidaBitmap;
                                        break;
                                case mBuraco:
                                                bitmapASerImpresso = buracoBitmap;
                                        break;
                        }
                        draw_sprite(buffer, bitmapASerImpresso, TILE_DIMENSAO*j, TILE_DIMENSAO*i);
                }
}

void Cenario::drawBuracosCor(BITMAP* buffer) const
{
        BITMAP* img = create_bitmap(TILE_DIMENSAO, TILE_DIMENSAO);
        for (list<Buraco>::const_iterator it = buracos.begin(); it != buracos.end(); it++)
        {
                clear_to_color(img, it->a.cor);
                draw_sprite(buffer, img, it->a.x*TILE_DIMENSAO, it->a.y*TILE_DIMENSAO);
                draw_sprite(buffer, img, it->b.x*TILE_DIMENSAO, it->b.y*TILE_DIMENSAO);
        }
        destroy_bitmap(img);
}

/** @brief load
  *
  * @todo: document this function
  */
void Cenario::load()
{
        vazioBitmap = load_bitmap("vazio.bmp", NULL);

        comidaBitmap = load_bitmap("comida.bmp", NULL);

        paredeBitmap = load_bitmap("parede.bmp", NULL);

        buracoBitmap = load_bitmap("buraco.bmp", NULL);

}

/** @brief snakeComeu
  *
  * @todo: document this function
  */
void Cenario::snakeComeu(int linha, int coluna)
{
        matriz[linha][coluna] = mVazio;
        criarComida();
}

/** @brief unload
  *
  * @todo: document this function
  */
void Cenario::unload()
{
        destroy_bitmap(comidaBitmap);
        destroy_bitmap(vazioBitmap);
        destroy_bitmap(paredeBitmap);
}

/** @brief criarComida
  *
  * @todo: document this function
  */
void Cenario::criarComida()
{
        int linha, coluna;
        do
        {
                linha = rand()%(Jogo::LINHAS-1);
                coluna = rand()%(Jogo::COLUNAS-1);
        } while (matriz[linha][coluna] == mParede || matriz[linha][coluna] == mBuraco);

        matriz[linha][coluna] = mComida;
}

/** @brief getCode
  *
  * @todo: document this function
  */
eMatrixCode Cenario::getCode(int linha, int coluna) const
{
        if (linha >= Jogo::LINHAS || coluna >= Jogo::COLUNAS || linha < 0 || coluna < 0)
                throw ("Acesso a região indevida");
        return matriz[linha][coluna];
}

/** @brief getSaidaDoBuraco
  *
  * @todo: document this function
  */
Ponto Cenario::getSaidaDoBuraco(int x, int y)
{
        for (list<Buraco>::iterator it = buracos.begin(); it != buracos.end(); it++ ) //Desenha os buracos na matriz
        {
                if (it->a.x == x && it->a.y == y)
                        return it->b;
                if (it->b.x == x && it->b.y == y)
                        return it->a;
        }
}


