import torch
import torch.nn as nn


class CNNBranch(nn.Module):
    """
    Branche CNN du modele hybride CNN+LSTM.
    Entree : (batch_size, 1, 6000) --- segment ECG filtre, 60s a 100Hz
    Sortie : (batch_size, 2048) --- vecteur de features compact
    """

    def __init__(self):
        super(CNNBranch, self).__init__()

        self.cnn = nn.Sequential(

            # Couche 1 : detecte motifs larges (onde P, QRS, T)
            # kernel=25 => 0.25s a 100Hz | stride=2 reduit par 2 | padding=12 conserve la longueur
            # Entree : (batch, 1, 6000) => Sortie : (batch, 32, 750)
            nn.Conv1d(in_channels=1, out_channels=32,
                      kernel_size=25, stride=2, padding=12),
            nn.BatchNorm1d(32),
            nn.ReLU(),
            nn.MaxPool1d(4),

            # Couche 2 : detecte patterns intermediaires
            # kernel=15 => 0.15s | Entree : (batch, 32, 750) => Sortie : (batch, 64, 187)
            nn.Conv1d(in_channels=32, out_channels=64,
                      kernel_size=15, stride=1, padding=7),
            nn.BatchNorm1d(64),
            nn.ReLU(),
            nn.MaxPool1d(4),

            # Couche 3 : detecte les details fins
            # kernel=9 | Entree : (batch, 64, 187) => Sortie : (batch, 128, 187)
            nn.Conv1d(in_channels=64, out_channels=128,
                      kernel_size=9, stride=1, padding=4),
            nn.BatchNorm1d(128),
            nn.ReLU(),

            # Compression : ramene a 16 points quelle que soit la longueur
            # Entree : (batch, 128, 187) => Sortie : (batch, 128, 16)
            nn.AdaptiveAvgPool1d(16),

            # Aplatissement : (batch, 128, 16) => (batch, 2048)
            nn.Flatten()
        )

    def forward(self, x):
        """
        x : tenseur (batch_size, 1, 6000)
        retourne : tenseur (batch_size, 2048)
        """
        return self.cnn(x)


if __name__ == '__main__':
    print('cnn_branch.py charge avec succes')
