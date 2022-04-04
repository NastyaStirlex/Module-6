#pragma once
#include "ActivateFunction.h"
#include "Matrix.h"
#include <fstream>
using namespace std;

struct data_Network { int L; int* size; };
class Network
{
	int L;//слои
	int* size;//нейроны на каждом слое
	ActivateFunction actFunc;
	Matrix* weights;
	double** bios;//веса смещения
	double** neurons_val, ** neurons_err;//веса ошибки для нейронов
	double** neurons_bios_val;//значения нейронов смещения
public:
	void Init(data_Network data);
	void PrintConfig();
	void SetInput(double* values);

	double ForwardFeed();
	int SearchMaxIndex(double* value);
	void PrintValues(int L);

	void BackPropogation(double expect);
	void WeightsUpdater(double Ir);

	void SaveWeights();
	void ReadWeights();
};

