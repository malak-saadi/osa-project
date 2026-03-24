import torch
import torch.nn as nn
from torch.utils.data import DataLoader, TensorDataset
from sklearn.metrics import roc_auc_score
import os

class CNNClassifier(nn.Module):
    """Ajoute une couche de classification sur la sortie CNN (2048 -> 1)"""
    def __init__(self, cnn_branch):
        super(CNNClassifier, self).__init__()
        self.cnn = cnn_branch
        self.classifier = nn.Sequential(
            nn.Linear(2048, 256),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(256, 1),
            nn.Sigmoid()
        )

    def forward(self, x):
        features = self.cnn(x)
        return self.classifier(features)


def train_model(model, train_loader, val_loader, epochs=5, lr=1e-3):
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    print(f'Entrainement sur : {device}')
    model = model.to(device)

    criterion = nn.BCELoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=lr, weight_decay=1e-4)

    os.makedirs('checkpoints', exist_ok=True)
    best_val_loss = float('inf')

    for epoch in range(epochs):
        # Phase TRAIN
        model.train()
        train_loss = 0.0
        for ecg_b, lbl_b in train_loader:
            ecg_b = ecg_b.to(device)
            lbl_b = lbl_b.float().to(device)
            optimizer.zero_grad()
            pred = model(ecg_b).squeeze()
            loss = criterion(pred, lbl_b)
            loss.backward()
            nn.utils.clip_grad_norm_(model.parameters(), 1.0)
            optimizer.step()
            train_loss += loss.item()

        # Phase VALIDATION
        model.eval()
        val_loss = 0.0
        preds_val, truths_val = [], []
        with torch.no_grad():
            for ecg_b, lbl_b in val_loader:
                ecg_b = ecg_b.to(device)
                lbl_b = lbl_b.to(device)
                pred = model(ecg_b).squeeze()
                val_loss += criterion(pred, lbl_b).item()
                preds_val.extend(pred.cpu().numpy())
                truths_val.extend(lbl_b.cpu().numpy())

        avg_train = train_loss / len(train_loader)
        avg_val   = val_loss   / len(val_loader)
        auc = roc_auc_score(truths_val, preds_val)
        print(f'Epoch {epoch+1:3d} | Train: {avg_train:.4f} | Val: {avg_val:.4f} | AUC: {auc:.4f}')

        if avg_val < best_val_loss:
            best_val_loss = avg_val
            torch.save(model.state_dict(), 'checkpoints/best_model.pt')
            print(f'  Meilleur modele sauvegarde (epoch {epoch+1})')

    return model
