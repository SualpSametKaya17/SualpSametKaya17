"use client";

import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Loader2, Database } from "lucide-react";
import axios from "axios";

interface DbConfig {
  host: string;
  port: string;
  user: string;
  password: string;
}

export default function DatabaseSettings() {
  const [config, setConfig] = useState<DbConfig>({
    host: "",
    port: "3306",
    user: "",
    password: "",
  });

  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [databases, setDatabases] = useState<string[]>([]);
  const [selectedDatabase, setSelectedDatabase] = useState<string>("");
  const [tables, setTables] = useState<string[]>([]);
  const [error, setError] = useState<string>("");

  // Load saved config from localStorage
  useEffect(() => {
    const savedConfig = localStorage.getItem("dbConfig");
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    }
    const savedDb = localStorage.getItem("selectedDatabase");
    if (savedDb) {
      setSelectedDatabase(savedDb);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfig({
      ...config,
      [e.target.name]: e.target.value,
    });
  };

  const testConnection = async () => {
    setIsLoading(true);
    setError("");
    setDatabases([]);
    setIsConnected(false);

    try {
      const response = await axios.post("/api/database/test-connection", config);

      if (response.data.success) {
        setIsConnected(true);
        setDatabases(response.data.databases);
        // Save config to localStorage
        localStorage.setItem("dbConfig", JSON.stringify(config));
      } else {
        setError(response.data.error || "Bağlantı başarısız");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Bağlantı hatası oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDatabaseSelect = async (dbName: string) => {
    setSelectedDatabase(dbName);
    setIsLoading(true);
    setError("");
    setTables([]);

    try {
      const response = await axios.post("/api/database/get-tables", {
        ...config,
        database: dbName,
      });

      if (response.data.success) {
        setTables(response.data.tables);
        // Save selected database to localStorage
        localStorage.setItem("selectedDatabase", dbName);
      } else {
        setError(response.data.error || "Tablolar getirilemedi");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Tablo listesi alınamadı");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <Database className="mr-2" size={28} />
            MySQL Veritabanı Bağlantısı
          </h2>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Host / IP Adresi
                </label>
                <input
                  type="text"
                  name="host"
                  value={config.host}
                  onChange={handleInputChange}
                  placeholder="örn: 192.168.1.100"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Port
                </label>
                <input
                  type="text"
                  name="port"
                  value={config.port}
                  onChange={handleInputChange}
                  placeholder="3306"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kullanıcı Adı
              </label>
              <input
                type="text"
                name="user"
                value={config.user}
                onChange={handleInputChange}
                placeholder="Veritabanı kullanıcı adı"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Şifre
              </label>
              <input
                type="password"
                name="password"
                value={config.password}
                onChange={handleInputChange}
                placeholder="Veritabanı şifresi"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={testConnection}
              disabled={isLoading || !config.host || !config.user}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Bağlanıyor...</span>
                </>
              ) : (
                <span>Bağlantıyı Test Et</span>
              )}
            </button>

            {error && (
              <div className="flex items-center space-x-2 text-red-600 bg-red-50 px-4 py-3 rounded-lg">
                <XCircle size={20} />
                <span>{error}</span>
              </div>
            )}

            {isConnected && databases.length > 0 && (
              <div className="flex items-center space-x-2 text-green-600 bg-green-50 px-4 py-3 rounded-lg">
                <CheckCircle size={20} />
                <span>Bağlantı başarılı! {databases.length} veritabanı bulundu.</span>
              </div>
            )}
          </div>
        </div>

        {/* Database List */}
        {databases.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Veritabanları
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {databases.map((db) => (
                <button
                  key={db}
                  onClick={() => handleDatabaseSelect(db)}
                  className={`px-4 py-3 rounded-lg border-2 transition-all text-left ${
                    selectedDatabase === db
                      ? "border-blue-500 bg-blue-50 text-blue-700 font-medium"
                      : "border-gray-200 hover:border-gray-300 text-gray-700"
                  }`}
                >
                  {db}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tables List */}
        {tables.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Tablolar ({selectedDatabase})
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {tables.map((table) => (
                <div
                  key={table}
                  className="px-3 py-2 bg-gray-100 rounded text-sm text-gray-700"
                >
                  {table}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
