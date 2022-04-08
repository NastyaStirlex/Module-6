#pragma once
//#include "Network.h"
#include <chrono>
#include <fstream>
#include <iostream>
using namespace std; // из Network.h

struct data_Network { int L; int* size; };

struct data_info {
    double* pixels;
    int digit;
};

enum activateFunc { sigmoid = 1, ReLU, thx };

class ActivateFunction {
    activateFunc actFunc; //объект перечисляемого типа
public:
    void set();
    void use(double* value, int n);
    void useDer(double* value, int n); //производная
    double useDer(double value);
};

void ActivateFunction::set() {
    cout << "Set act Func pls\n1 - sigmoid \n2 - ReLU \n3 - th(x)\n";
    int temp;
    cin >> temp;
    switch (temp) {
    case sigmoid:
        actFunc = sigmoid;
        break;
    case ReLU:
        actFunc = ReLU;
        break;
    case thx:
        actFunc = thx;
        break;
    default:
        throw runtime_error("Error read actFunc"); //выбрасываем исключения программа останавливается
        break;

    }
}

void ActivateFunction::use(double* value, int n) { //формулы
    switch (actFunc) {
    case activateFunc::sigmoid:
        for (int i = 0; i < n; i++)
            value[i] = 1 / (1 + exp(-value[i]));
        break;
    case activateFunc::ReLU:
        for (int i = 0; i < n; i++) {
            if (value[i] < 0)
                value[i] *= 0.01;
            else if (value[i] > 1)
                value[i] = 1. + 0.01 * (value[i] - 1.);//else value=value
        }
        break;
    case activateFunc::thx:
        for (int i = 0; i < n; i++) {
            if (value[i] < 0)
                value[i] = 0.01 * (exp(value[i]) - exp(-value[i])) / (exp(value[i]) + exp(-value[i]));
            else
                value[i] = (exp(value[i]) - exp(-value[i])) / (exp(value[i]) + exp(-value[i]));
        }
        break;
    default:
        throw runtime_error("Error actFunc \n");
        break;
    }
}

void ActivateFunction::useDer(double* value, int n) {
    switch (actFunc) {
    case activateFunc::sigmoid:
        for (int i = 0; i < n; i++)
            value[i] = value[i] * (1 - value[i]);
        break;
    case activateFunc::ReLU:
        for (int i = 0; i < n; i++) {
            if (value[i] < 0 || value[i] >1)
                value[i] = 0.01;
            else
                value[i] = 1;
        }
        break;
    case activateFunc::thx:
        for (int i = 0; i < n; i++) {
            if (value[i] < 0)
                value[i] = 0.01 * (1 - value[i] * value[i]);
            else
                value[i] = 1 - value[i] * value[i];
        }
        break;
    default:
        throw runtime_error("Error actFuncDer \n");
        break;
    }
}

double ActivateFunction::useDer(double value) {
    switch (actFunc) {
    case activateFunc::sigmoid:
        value = 1 / (1 + exp(-value));
        break;
    case activateFunc::ReLU:
        if (value < 0 || value >1)
            value = 0.01;
        break;
    case activateFunc::thx:
        if (value < 0)
            value = 0.01 * (exp(value) - exp(-value)) / (exp(value) + exp(-value));
        else
            value = (exp(value) - exp(-value)) / (exp(value) + exp(-value));
        break;
    default:
        throw runtime_error("Error actFuncDer \n");
        break;
    }
    return value;
}

class Network {
    int L; //слои
    int* size; //нейроны на каждом слое
    ActivateFunction actFunc;
    Matrix* weights;
    double** bios; //веса смещения
    double** neurons_val, ** neurons_err; //веса ошибки для нейронов
    double* neurons_bios_val; //значения нейронов смещения
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

class Matrix {
    double** matrix;
    int row, col;
public:
    void Init(int row, int col);
    void Rand();
    static void Multi(const Matrix& m, const double* b, int n, double* c);
    static void Multi_T(const Matrix& m, const double* b, int n, double* c); //умножение транспонированной матрицы
    static void SumVector(double* a, const double* b, int n);
    double& operator()(int i, int j); //перегрузка оператора()
    friend ostream& operator << (ostream& os, const Matrix& m);
    friend istream& operator >> (istream& is, Matrix& m);
};

data_Network ReadDataNetWork(string path) {
    data_Network data{};
    ifstream fin;
    fin.open(path);
    if (!fin.is_open()) {
        cout << "Error reading the file " << path << endl;
        system("pause");
    }
    else
        cout << path << " loading...\n";
    string tmp;
    int L;
    while (!fin.eof()) {
        fin >> tmp;
        if (tmp == "Network") {
            fin >> L;
            data.L = L;
            data.size = new int[L];
            for (int i = 0; i < L; i++) {
                fin >> data.size[i];
            }
        }
    }
    fin.close();
    return data;
}

data_info* ReadData(string path, const data_Network& data_NW, int& examples) {
    data_info* data;
    ifstream fin;
    fin.open(path);
    if (!fin.is_open()) {
        cout << "Error reading the file " << path << endl;
        system("pause");
    }
    else
        cout << path << " loading... \n";
    string tmp;
    fin >> tmp;
    if (tmp == "Examples") {
        fin >> examples;
        cout << "Examples: " << examples << endl;
        data = new data_info[examples];
        for (int i = 0; i < examples; ++i)
            data[i].pixels = new double[data_NW.size[0]];

        for (int i = 0; i < examples; ++i) {
            fin >> data[i].digit;
            for (int j = 0; j < data_NW.size[0]; ++j) {
                fin >> data[i].pixels[j];
            }
        }
        fin.close();
        cout << "lib_MNIST loaded... \n";
        return data;
    }
    else {
        cout << "Error loading: " << path << endl;
        fin.close();
        return nullptr;
    }
}

void Network::Init(data_Network data) {
    actFunc.set();
    srand(time(NULL));
    L = data.L;
    size = new int[L - 1];
    for (int i = 0; i < L; i++)
        size[i] = data.size[i];

    weights = new Matrix[L - 1];
    bios = new double* [L - 1];
    for (int i = 0; i < L - 1; i++) {
        weights[i].Init(size[i + 1], size[i]);
        bios[i] = new double[size[i + 1]];
        weights[i].Rand();
        for (int j = 0; j < size[i + 1]; j++) {
            bios[i][j] = ((rand() % 50)) * 0.06 / (size[i] + 15);
        }
    }
    neurons_val = new double* [L - 1]; neurons_err = new double* [L - 1];
    for (int i = 0; i < L; i++) {
        neurons_val[i] = new double[size[i]]; neurons_err[i] = new double[size[i]];
    }
    neurons_bios_val = new double[L - 1];
    for (int i = 0; i < L - 1; i++)
        neurons_bios_val[i] = 1;
}

void Network::PrintConfig() {
    cout << "***********************************************************\n";
    cout << "Network has " << L << " layers\nSIZE[]: ";
    for (int i = 0; i < L; i++) {
        cout << size[i] << " ";
    }
    cout << "\n***********************************************************\n\n";
}

void Network::SetInput(double* values) {
    for (int i = 0; i < size[0]; i++) {
        neurons_val[0][i] = values[i];
    }
}

double Network::ForwardFeed() {
    for (int k = 1; k < L; ++k) {
        Matrix::Multi(weights[k - 1], neurons_val[k - 1], size[k - 1], neurons_val[k]);
        Matrix::SumVector(neurons_val[k], bios[k - 1], size[k]);
        actFunc.use(neurons_val[k], size[k]);
    }
    int pred = SearchMaxIndex(neurons_val[L - 1]);
    return pred;
}

int Network::SearchMaxIndex(double* value) {
    double max = value[0];
    int prediction = 0;
    double tmp;
    for (int j = 1; j < size[L - 1]; j++) {
        tmp = value[j];
        if (tmp > max) {
            prediction = j;
            max = tmp;
        }
    }
    return prediction;
}

void Network::PrintValues(int L) {
    for (int j = 0; j < size[L]; j++) {
        cout << j << " " << neurons_val[L][j] << endl;
    }
}

void Network::BackPropogation(double expect) {
    for (int i = 0; i < size[L - 1]; i++) {
        if (i != int(expect))
            neurons_err[L - 1][i] = -neurons_val[L - 1][i] * actFunc.useDer(neurons_val[L - 1][i]);
        else
            neurons_err[L - 1][i] = (1.0 - neurons_val[L - 1][i]) * actFunc.useDer(neurons_val[L - 1][i]);
    }
    for (int k = L - 2; k > 0; k--) {
        Matrix::Multi_T(weights[k], neurons_err[k + 1], size[k + 1], neurons_err[k]);
        for (int j = 0; j < size[k]; j++)
            neurons_err[k][j] *= actFunc.useDer(neurons_val[k][j]);
    }
}

void Network::WeightsUpdater(double lr) {
    for (int i = 0; i < L - 1; ++i) {
        for (int j = 0; j < size[i + 1]; ++j) {
            for (int k = 0; k < size[i]; ++k) {
                weights[i](j, k) += neurons_val[i][k] * neurons_err[i + 1][j] * lr;
            }
        }
    }
    for (int i = 0; i < L - 1; i++) {
        for (int k = 0; k < size[i + 1]; k++) {
            bios[i][k] += neurons_err[i + 1][k] * lr;
        }
    }
}

void Network::SaveWeights() {
    ofstream fout;
    fout.open("Weights.txt");
    if (!fout.is_open()) {
        cout << "Error reading the file";
        system("pause");
    }
    for (int i = 0; i < L - 1; ++i)
        fout << weights[i] << " ";

    for (int i = 0; i < L - 1; ++i) {
        for (int j = 0; j < size[i + 1]; ++j) {
            fout << bios[i][j] << " ";
        }
    }
    cout << "Weights saved \n";
    fout.close();
}

void Network::ReadWeights() {
    ifstream fin;
    fin.open("Weights.txt");
    if (!fin.is_open()) {
        cout << "Error reading the file";
        system("pause");
    }
    for (int i = 0; i < L - 1; ++i) {
        fin >> weights[i];
    }
    for (int i = 0; i < L - 1; ++i) {
        for (int j = 0; j < size[i + 1]; ++j) {
            fin >> bios[i][j];
        }
    }
    cout << "Weights readed \n";
    fin.close();
}

void Matrix::Init(int row, int col) {
    this->row = row; this->col = col;
    matrix = new double* [row];
    for (int i = 0; i < row; i++)
        matrix[i] = new double[col];

    for (int i = 0; i < row; i++) {
        for (int j = 0; j < col; j++) {
            matrix[i][j] = 0;
        }
    }
}

void Matrix::Rand() {
    for (int i = 0; i < row; i++) {
        for (int j = 0; j < col; j++) {
            matrix[i][j] = ((rand() % 100)) * 0.03 / (row + 35);
        }
    }
}

void Matrix::Multi(const Matrix& m1, const double* neuron, int n, double* c) {
    if (m1.col != n)
        throw runtime_error("Error Multi \n"); //iskluchenia
    for (int i = 0; i < m1.row; ++i) {
        double tmp = 0;
        for (int j = 0; j < m1.col; ++j) {
            tmp += m1.matrix[i][j] * neuron[j];
        }
        c[i] = tmp;
    }
}

void Matrix::Multi_T(const Matrix& m1, const double* neuron, int n, double* c) {
    if (m1.row != n)
        throw runtime_error("Error Multi \n"); //iskluchenia
    for (int i = 0; i < m1.col; ++i) {
        double tmp = 0;
        for (int j = 0; j < m1.row; ++j) {
            tmp += m1.matrix[j][i] * neuron[j];
        }
        c[i] = tmp;
    }
}

double& Matrix::operator()(int i, int j) {
    return matrix[i][j];
}

void Matrix::SumVector(double* a, const double* b, int n) {
    for (int i = 0; i < n; i++)
        a[i] += b[i];
}

ostream& operator<<(ostream& os, const Matrix& m) {
    for (int i = 0; i < m.row; ++i) {
        for (int j = 0; j < m.col; j++) {
            os << m.matrix[i][j] << " ";
        }
    }
    return os;
}

istream& operator >>(istream& is, Matrix& m) {
    for (int i = 0; i < m.row; ++i) {
        for (int j = 0; j < m.col; j++) {
            is >> m.matrix[i][j];
        }
    }
    return is;
}

int main() {
    Network NW{};
    data_Network NW_config;
    data_info* data;
    double ra = 0, right, predict, maxra = 0;
    int epoch = 0;
    bool study, repeat = true;
    chrono::duration<double> time;

    NW_config = ReadDataNetWork("Config.txt");
    NW.Init(NW_config);
    NW.PrintConfig();

    while (repeat) {
        cout << "STUDY? (1/0)" << endl;
        cin >> study;
        if (study) {
            int examples;
            data = ReadData("lib_MNIST_edit.txt", NW_config, examples);
            auto begin = chrono::steady_clock::now();
            while (ra / examples * 100 < 100) {
                ra = 0;
                auto t1 = chrono::steady_clock::now();
                for (int i = 0; i < examples; ++i) {
                    NW.SetInput(data[i].pixels);
                    right = data[i].digit;
                    predict = NW.ForwardFeed();
                    if (predict != right) {
                        NW.BackPropogation(right);
                        NW.WeightsUpdater(0.15 * exp(-epoch / 20.));
                    }
                    else
                        ra++;
                }
                auto t2 = chrono::steady_clock::now();
                time = t2 - t1;
                if (ra > maxra) maxra = ra;
                cout << "ra: " << ra / examples * 100 << "\t" << "maxra: " << maxra / examples * 100 << "\t" << "epoch: " << epoch << "\tTIME: " << time.count() << endl;
                epoch++;
                if (epoch == 20)
                    break;
            }
            auto end = chrono::steady_clock::now();
            time = end - begin;
            cout << "TIME: " << time.count() / 60. << " min" << endl;
            NW.SaveWeights();
        }
        else {
            NW.ReadWeights();
        }
        cout << "Test? (1/0)\n";
        bool test_flag;
        cin >> test_flag;
        if (test_flag) {
            int ex_tests;
            data_info* data_test;
            data_test = ReadData("lib_10k.txt", NW_config, ex_tests);
            ra = 0;
            for (int i = 0; i < ex_tests; ++i) {
                NW.SetInput(data_test[i].pixels);
                predict = NW.ForwardFeed();
                right = data_test[i].digit;
                if (right == predict)
                    ra++;
            }
            cout << "RA: " << ra / ex_tests * 100 << endl;
        }
        cout << "Repeat? (1/0)\n";
        cin >> repeat;
    }
    system("pause");

    return 0;
}
